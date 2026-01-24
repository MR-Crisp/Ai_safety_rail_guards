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
      // FastAPI endpoint - make sure this matches your backend
      const res = await fetch("http://localhost:8000/similarity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_text: context,
          user_text: prompt,
          threshold: 0.4
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Backend error");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Backend not running or CORS blocked");
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
          required
        />

        <textarea
          placeholder="Enter context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Check Similarity"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Result</h2>
          <p>
            Similarity: <b>{Math.round(result.score * 100)}%</b>
          </p>
          <p>
            Status: <b style={{ color: result.passes_threshold ? "green" : "red" }}>
              {result.passes_threshold ? "✓ Passes Threshold" : "✗ Below Threshold"}
            </b>
          </p>
          <p style={{ fontSize: "0.9em", color: "#666" }}>
            Threshold: {result.threshold} | Processing time: {result.processing_time_ms}ms
          </p>
        </div>
      )}

      <footer>
        <p>Created by Aamir, Adam, Alejandro and Rochak</p>
      </footer>
    </div>
  );
}