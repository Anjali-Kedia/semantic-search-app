### 📁 `README.md` – Frontend (Next.js + Tailwind CSS)

```markdown
# 🌐 Semantic Search App – Frontend

This is the frontend interface for the Semantic Search App. It allows users to input a website URL, index its content, and semantically search across the crawled and chunked content using a clean, responsive UI.

---

## 🖥 Tech Stack

- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS v4 (with dark mode support)
- API Layer: Fetch calls to FastAPI backend
- Vector Search: Integrates with Pinecone via backend
- Embeddings: `all-MiniLM-L6-v2` from SentenceTransformers (server-side)

---

## 🚀 Features

- 🌍 Website URL crawling and content indexing  
- 🔍 Semantic search on indexed content  
- 🎨 Light/Dark Mode Toggle with localStorage  
- 📄 Renders results with section, path, content snippet, and full HTML view  
- ✅ Dynamic feedback for loading, errors, and match confidence

---

## 📂 Folder Structure

website-search-frontend/
├── app/
│   ├── layout.tsx            # Root layout with fonts and global styles
│   └── page.tsx              # Home page component and UI logic
│
├── components/
│   ├── ResultCard.tsx        # UI card component to display each search result
│   └── ThemeProvider.tsx     # Toggle and persist dark/light mode
│
├── lib/
│   └── api.ts                # Frontend API helpers to call backend /index and /search
│
├── public/                   # Static assets (e.g., icons, images)
│
│
├── postcss.config.mjs        # Tailwind CSS config for PostCSS
└── README.md                 # Frontend usage and setup guide


---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/semantic-search-app.git
cd semantic-search-app/website-search-frontend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


---

## 🌗 Dark Mode

The app supports dark/light mode using:

* Tailwind's `dark:` classes
* A `ThemeProvider` component with `localStorage` persistence
* Toggle button fixed to the top-right of the screen

---

## 🌐 API Integration

Configured to hit the backend at:

```ts
const BACKEND_URL = "http://localhost:8000";
```

Make sure the backend is running before indexing or querying.

---

## 🧪 Functional Flow

1. User enters a website URL.
2. App hits `/index` API → backend crawls, chunks, embeds, and indexes the content.
3. User enters a query.
4. App hits `/search` API → backend returns top matches with relevance scores and HTML snippets.
5. User views results in `ResultCard` format.

---

## 📌 Notes

* API URL is hardcoded to localhost .

---
