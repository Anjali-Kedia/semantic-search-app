### 📁 `README.md` – Backend Section (FastAPI + Pinecone)

````markdown
# 🔎 Semantic Search App – Backend

This backend powers the Semantic Search App, enabling website content to be crawled, chunked, embedded using Sentence Transformers, and indexed into Pinecone for efficient semantic querying. Built using FastAPI and Pinecone vector DB.

---

## 🚀 Features

- Crawl and parse HTML pages recursively (within same domain)
- Chunk meaningful content (headers, paragraphs, list items)
- Embed content using `sentence-transformers` (MiniLM model)
- Store vector embeddings and metadata in Pinecone
- Perform semantic similarity search on indexed content
- Serve API via FastAPI for frontend integration

---

## 📦 Tech Stack

- Python 3.10+
- FastAPI
- Pinecone Vector DB (Serverless)
- SentenceTransformers (all-MiniLM-L6-v2)
- BeautifulSoup (HTML parsing)
- Uvicorn (ASGI server)

---

## 🧰 Prerequisites

1. Python 3.10+
2. A Pinecone account (https://www.pinecone.io/)
3. A Pinecone project with an API Key and configured region

---

## ⚙️ Environment Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/semantic-search-app.git
cd semantic-search-app/backend
````

### 2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create `.env` file

```env
PINECONE_API_KEY=your-pinecone-api-key
```

---

## 🛠 Configuration Details

* **Vector dimensions**: 384 (used by MiniLM)
* **Metric**: cosine similarity
* **Pinecone Region**: us-east-1
* **Namespace**: `default`
* **Index Name**: `semantic-search` (created automatically if not exists)

---

## ▶️ Running the Backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --env-file .env
```

* Server will run on: `http://localhost:8000`
* To view on UI you can go to url: `http://localhost:8000/docs`
* CORS is enabled for all origins to support frontend development

---

## 🧪 API Endpoints

### 1. `/index`

Crawl a website and index all relevant content

**POST**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "message": "Indexing completed.",
  "chunks_indexed": 34
}
```

---

### 2. `/search`

Perform a semantic search query on the indexed content

**POST**

```json
{
  "query": "ai chatbot"
}
```

**Response:**

```json
{
  "query": "ai chatbot",
  "results": [
    {
      "score": 84.12,
      "section": "ConciergeBot – Chatbot for Hotel Direct Bookings",
      "content": "A chatbot built using Hybrid.Chat platform that lets hotel guests get travel suggestions...",
      "path": "/case-studies/",
      "html": "<p>A chatbot built using Hybrid.Chat platform...</p>"
    },
    ...
  ]
}
```

---

## 📁 Backend Folder Structure

```
backend/
│
├── main.py                 # FastAPI app with endpoints
├── backend_utils.py        # Core logic for crawling, embedding, Pinecone I/O
├── .env                    # Contains PINECONE_API_KEY
├── requirements.txt
└── README.md               # You're here!
```

---

