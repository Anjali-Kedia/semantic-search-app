# backend_utils.py
import os
import hashlib
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import List, Dict
import numpy as np
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "semantic-search"
DIMENSION = 384
NAMESPACE = "default"

pc = Pinecone(api_key=PINECONE_API_KEY)
if INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
        name=INDEX_NAME,
        dimension=DIMENSION,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
index = pc.Index(INDEX_NAME)

model = SentenceTransformer("all-MiniLM-L6-v2")

# ----------------------- HTML UTILS -----------------------
def fetch_html(url: str) -> str:
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.text

def extract_links(html: str, base_url: str) -> List[str]:
    soup = BeautifulSoup(html, "html.parser")
    domain = urlparse(base_url).netloc
    links = set()
    for tag in soup.find_all("a", href=True):
        full_url = urljoin(base_url, tag['href'])
        parsed = urlparse(full_url)
        if parsed.netloc == domain:
            clean = parsed.scheme + "://" + parsed.netloc + parsed.path
            links.add(clean)
    return list(links)

def clean_and_chunk_html(html: str, url_path: str) -> List[Dict]:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()

    chunks = []
    section = "Untitled"
    for tag in soup.find_all(["h1", "h2", "h3", "p", "li"]):
        text = tag.get_text(strip=True)
        if tag.name in ["h1", "h2", "h3"]:
            section = text
        elif len(text.split()) > 10:
            chunks.append({
                "section": section,
                "content": text,
                "path": url_path,
                "html": str(tag)
            })
    return chunks

# --------------------- PINECONE UTILS ---------------------
def embed_and_upsert(chunks: List[Dict]):
    texts = [c["content"] for c in chunks]
    embeddings = model.encode(texts, convert_to_numpy=True)

    to_upsert = []
    for chunk, vector in zip(chunks, embeddings):
        uid = hashlib.md5(chunk['content'].encode()).hexdigest()
        to_upsert.append({
            "id": uid,
            "values": vector.tolist(),
            "metadata": {
                "section": chunk["section"],
                "content": chunk["content"],
                "path": chunk["path"],
                "html": chunk["html"][:4000]
            }
        })
    index.upsert(vectors=to_upsert, namespace=NAMESPACE)

def query_index(text: str, top_k=10):
    query_emb = model.encode(text).tolist()
    result = index.query(
        vector=query_emb,
        top_k=top_k,
        include_metadata=True,
        namespace=NAMESPACE
    )
    return [
        {
            "score": round(m['score'] * 100, 2),
            **m['metadata']
        }
        for m in result["matches"] if m["score"] >= 0.03
    ]

# ----------------------- FLOW UTILS -----------------------
def crawl_and_index(url: str, max_pages: int = 100) -> int:
    seen = set()
    to_visit = [url]
    all_chunks = []

    while to_visit and len(seen) < max_pages:
        current_url = to_visit.pop(0)
        if current_url in seen:
            continue

        try:
            html = fetch_html(current_url)
            seen.add(current_url)

            # Extract and clean chunks
            chunks = clean_and_chunk_html(html, urlparse(current_url).path)

            # Filter out already indexed chunks using hashes
            filtered_chunks = []
            for chunk in chunks:
                chunk_id = hashlib.md5(chunk['content'].encode()).hexdigest()
                exists = index.fetch(ids=[chunk_id], namespace=NAMESPACE)
                if not exists or not exists.vectors:
                    filtered_chunks.append(chunk)

            all_chunks.extend(filtered_chunks)

            # Add new links to the queue
            new_links = extract_links(html, current_url)
            for link in new_links:
                if link not in seen and link not in to_visit:
                    to_visit.append(link)

        except Exception as e:
            print(f"Failed to process {current_url}: {e}")
            continue

    # Only embed and upsert if there are new chunks
    if all_chunks:
        embed_and_upsert(all_chunks)

    return len(all_chunks)
