import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [context, setContext] = useState("");     // context input
  const [prompt, setPrompt] = useState("");       // prompt input
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Only trigger when "Get Result" button is clicked
  const handleGetResult = async () => {
    if (!context || !prompt) {
      setError("Both context and prompt are required");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/similarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context_text: context,
          user_text: prompt,
          threshold: 0.4,
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

      {/* Context Form */}
      <div className="input-section">
        <h3>Step 1: Enter Context</h3>
        <textarea
          placeholder="Enter context text here..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={6}
        />
      </div>

      {/* Prompt Form */}
      <div className="input-section">
        <h3>Step 2: Enter Prompt</h3>
        <textarea
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
      </div>

      {/* Get Result Button */}
      <div className="input-section">
        <button onClick={handleGetResult} disabled={loading}>
          {loading ? "Processing..." : "Get Result"}
        </button>
      </div>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Result */}
      {result && (
        <div className="result-section">
          <h2>Similarity Result</h2>
          <p>
            Similarity Score: <b>{Math.round(result.score * 100)}%</b>
          </p>
          <p>
            Status:{" "}
            <b style={{ color: result.passes_threshold ? "green" : "red" }}>
              {result.passes_threshold ? "✓ Passes Threshold" : "✗ Below Threshold"}
            </b>
          </p>
          <p style={{ fontSize: "0.9em", color: "#666" }}>
            Threshold: {result.threshold}
          </p>
        </div>
      )}

      <footer>
        <p>Created by Aamir, Adam, Alejandro and Rochak</p>
      </footer>
    </div>
  );
}
