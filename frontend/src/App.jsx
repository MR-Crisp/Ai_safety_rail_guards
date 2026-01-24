import React, { useState } from "react";
import "./App.css"; 

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/similarity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, context }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Backend not running or CORS blocked");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Context Similarity Detector</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <textarea
          placeholder="Enter context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />

        <button type="submit">{loading ? "Checking..." : "Check Similarity"}</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Result</h2>
          <p>Similarity: <b>{Math.round(result.similarity * 100)}%</b></p>
          {result.explanation && <p>{result.explanation}</p>}
        </div>
      )}

      <footer>
        <p>London Spitfire Themed Similarity App</p>
      </footer>
    </div>
  );
}
