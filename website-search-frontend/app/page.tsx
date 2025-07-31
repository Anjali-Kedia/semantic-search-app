"use client";

import { useState } from "react";
import { fetchChunks, searchQuery } from "@/lib/api";
import ResultCard from "@/components/ResultCard";

interface SearchResult {
  section: string;
  content: string;
  path: string;
  html: string;
  score: number;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [indexing, setIndexing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [indexed, setIndexed] = useState(false);

  const handleIndex = async () => {
    setError("");
    setResults([]);
    setIndexed(false);

    if (!url) {
      setError("Please enter a website URL to index.");
      return;
    }

    setIndexing(true);
    try {
      await fetchChunks(url);
      setIndexed(true);
    } catch (err) {
      setError("Indexing failed. Please check the URL and try again.");
      console.error("Indexing error:", err);
    }
    setIndexing(false);
  };

  const handleSearch = async () => {
    setError("");
    setResults([]);

    if (!query) {
      setError("Please enter a search query.");
      return;
    }

    setSearching(true);
    try {
      const res = await searchQuery(query);
      console.log("Search result:", res); 
      setResults(res.results || []);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error("Search error:", err);
    }
    setSearching(false);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔍 Website Semantic Search</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL to index"
        className="w-full p-2 border border-gray-300 rounded-md mb-3"
      />
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleIndex}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-60"
          disabled={indexing}
        >
          {indexing ? "Indexing..." : "Index Website"}
        </button>
        <span className="text-sm text-green-700 mt-2">{indexed && "✅ Indexed"}</span>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your search query"
        className="w-full p-2 border border-gray-300 rounded-md mb-3"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        disabled={searching}
      >
        {searching ? "Searching..." : "Search"}
      </button>

      {error && <p className="text-red-600 mt-3">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Top Results</h2>
          {results.map((res, idx) => (
            <ResultCard
              key={idx}
              index={idx}
              section={res.section}
              content={res.content}
              path={res.path}
              html={res.html}
              score={res.score}
            />
          ))}
        </div>
      )}
    </main>
  );
}
