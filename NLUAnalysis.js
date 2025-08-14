import React, { useState } from "react";

function NLUAnalysis() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyzeText = async () => {
    setError("");
    setResult(null);

    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/nlu_analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "error") {
        setError(data.message);
      } else {
        setResult(data.analysis);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>🔍 NLU Analysis</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here"
        rows="5"
        cols="60"
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "15px",
        }}
      />
      <br />
      <button
        onClick={analyzeText}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Analyze
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "15px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            display: "inline-block",
            background: "#f9f9f9",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Result</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default NLUAnalysis;
