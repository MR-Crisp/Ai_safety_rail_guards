import React, { useState } from "react";
import "./App.css";

export default function App() {
  // Step inputs
  const [context, setContext] = useState("");
  const [prompt, setPrompt] = useState("");
  const [llm, setLLM] = useState("");

  // Submitted values
  const [submittedContext, setSubmittedContext] = useState(null);
  const [submittedPrompt, setSubmittedPrompt] = useState(null);
  const [submittedLLM, setSubmittedLLM] = useState(null);

  // Result + status
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Submit / Reset handlers ---

  const handleSubmitContext = () => {
    if (!context) return setError("Context cannot be empty");
    setSubmittedContext(context);
    setContext("");
    setError(null);
    setResult(null);
  };

  const handleResetContext = () => {
    setSubmittedContext(null);
    setContext("");
    setSubmittedPrompt(null);
    setPrompt("");
    setSubmittedLLM(null);
    setLLM("");
    setResult(null);
    setError(null);
  };

  const handleSubmitPrompt = () => {
    if (!prompt) return setError("Prompt cannot be empty");
    setSubmittedPrompt(prompt);
    setPrompt("");
    setError(null);
    setResult(null);
  };

  const handleResetPrompt = () => {
    setSubmittedPrompt(null);
    setPrompt("");
    setSubmittedLLM(null);
    setLLM("");
    setResult(null);
    setError(null);
  };

  const handleSubmitLLM = () => {
    if (!llm) return setError("LLM cannot be empty");
    setSubmittedLLM(llm);
    setLLM("");
    setError(null);
    setResult(null);
  };

  const handleResetLLM = () => {
    setSubmittedLLM(null);
    setLLM("");
    setResult(null);
    setError(null);
  };

  // --- Fetch similarity result ---
  const handleGetResult = async () => {
    if (!submittedContext || !submittedPrompt || !submittedLLM) {
      return setError("Context, prompt, and LLM must all be submitted first");
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/similarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context_text: submittedContext,
          user_text: submittedPrompt,
          threshold: 0.4,
          llm: submittedLLM, // optional extra field for backend
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

      {/* --- Step 1: Context --- */}
      <div className="input-section">
        <h3>Step 1: Enter Context</h3>
        <textarea
          placeholder="Enter context..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={4}
        />
        <div style={{ marginTop: 10 }}>
          <button onClick={handleSubmitContext}>Submit Context</button>
          <button onClick={handleResetContext} style={{ marginLeft: 10 }}>
            Reset Context
          </button>
        </div>
        {submittedContext && <p><b>Submitted Context:</b> {submittedContext}</p>}
      </div>

      {/* --- Step 2: Prompt --- */}
      <div className="input-section">
        <h3>Step 2: Enter Prompt</h3>
        <textarea
          placeholder="Enter prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          disabled={!submittedContext}
        />
        <div style={{ marginTop: 10 }}>
          <button
            onClick={handleSubmitPrompt}
            disabled={!submittedContext}
          >
            Submit Prompt
          </button>
          <button
            onClick={handleResetPrompt}
            style={{ marginLeft: 10 }}
            disabled={!submittedPrompt && !submittedLLM}
          >
            Reset Prompt
          </button>
        </div>
        {submittedPrompt && <p><b>Submitted Prompt:</b> {submittedPrompt}</p>}
      </div>

      {/* --- Step 3: LLM --- */}
      <div className="input-section">
        <h3>Step 3: Enter Website Chatbot Answer</h3> 
        <textarea
          placeholder="Enter Answer..."
          value={llm}
          onChange={(e) => setLLM(e.target.value)}
          rows={3}
          disabled={!submittedContext}
        />
        <div style={{ marginTop: 10 }}>
          <button
            onClick={handleSubmitLLM}
            disabled={!submittedPrompt}
          >
            Submit 
          </button>
          <button
            onClick={handleResetLLM}
            style={{ marginLeft: 10 }}
            disabled={!submittedLLM}
          >
            Reset 
          </button>
        </div>
        {submittedLLM && <p><b>Submitted LLM:</b> {submittedLLM}</p>}
      </div>

      {/* --- Step 4: Get Result --- */}
      <div className="input-section">
        <button
          onClick={handleGetResult}
          disabled={
            !submittedContext || !submittedPrompt || !submittedLLM || loading
          }
        >
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
