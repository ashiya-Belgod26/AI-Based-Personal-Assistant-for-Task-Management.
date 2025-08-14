import React, { useState } from "react";

function QA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState("");

  const askQuestion = async () => {
    setError("");
    setAnswer(null);

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "error") {
        setError(data.message);
      } else {
        setAnswer(data.answer);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>💬 Q&A</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your question"
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "60%",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "15px",
        }}
      />
      <br />
      <button
        onClick={askQuestion}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Ask
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "15px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {answer && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            display: "inline-block",
            background: "#f9f9f9",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            width: "60%",
            wordWrap: "break-word",
          }}
        >
          <h3>Answer</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(answer, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default QA;
