//website-search-frontend/components/ResultCard.tsx
"use client";
import { useState } from "react";

interface Props {
  index: number;
  section: string;
  content: string;
  path: string;
  html: string;
  score: number;
}

export default function ResultCard({
  index,
  section,
  content,
  path,
  html,
  score,
}: Props) {
  const [showHtml, setShowHtml] = useState(false);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="bg-white dark:bg-zinc-800 shadow-md dark:shadow-lg rounded-xl p-4 mb-6 border border-gray-100 dark:hover:bg-zinc-700">
      <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
        Result #{index + 1}:{" "}
        <span className="text-gray-800 dark:text-white">{section || "Untitled Section"}</span>
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Path: {path || "/"}
      </p>
      <p className="text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">
        {content}
      </p>

      <div className="flex items-center justify-between">
        <span className={`${getScoreColor(score)} font-medium`}>
          {score.toFixed(1)}% match
        </span>
        <button
          onClick={() => setShowHtml(!showHtml)}
          className="text-blue-600 dark:text-blue-400 text-sm hover:underline focus:outline-none"
        >
          {showHtml ? "Hide HTML" : "View HTML"}
        </button>
      </div>

      {showHtml && (
        <pre className="mt-3 bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-sm text-gray-800 dark:text-gray-100 overflow-auto max-h-60">
          {html}
        </pre>
      )}
    </div>
  );
}
