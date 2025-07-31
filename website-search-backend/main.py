# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend_utils import crawl_and_index, query_index
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CrawlRequest(BaseModel):
    url: str

class SearchRequest(BaseModel):
    query: str

@app.post("/index")
def index_url(request: CrawlRequest):
    try:
        chunks_indexed = crawl_and_index(request.url)
        return {"message": "Indexing completed.", "chunks_indexed": chunks_indexed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/search")
def search(request: SearchRequest):
    try:
        results = query_index(request.query)
        return {"query": request.query, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
