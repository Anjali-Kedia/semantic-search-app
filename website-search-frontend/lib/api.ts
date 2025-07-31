//website-search-frontend/lib/api.ts
const BACKEND_URL = "http://localhost:8000";

export const fetchChunks = async (url: string) => {
  const response = await fetch(`${BACKEND_URL}/index`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) throw new Error("Failed to index URL content.");
  return response.json(); 
};

export const searchQuery = async (query: string) => {
  const response = await fetch(`${BACKEND_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error("Failed to perform semantic search.");
  return response.json();
};
