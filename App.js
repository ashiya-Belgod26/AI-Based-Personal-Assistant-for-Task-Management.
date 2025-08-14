import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFunction, setSelectedFunction] = useState("nlu_analysis");
  const [inputData, setInputData] = useState("");
  const [extraData, setExtraData] = useState({ expenses: {} });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const API_BASE = "http://127.0.0.1:8000";

  const handleSubmit = async () => {
    setError("");
    let endpoint = "";
    let body = {};

    switch (selectedFunction) {
      case "nlu_analysis":
        endpoint = "/nlu_analysis";
        body = { text: inputData };
        break;
      case "budget_summary":
        endpoint = "/budget_summary";
        body = {
          income: parseFloat(extraData.income) || 0,
          expenses: extraData.expenses
        };
        break;
      case "qa":
        endpoint = "/qa";
        body = { question: inputData };
        break;
      case "spending_insights":
        endpoint = "/spending_insights";
        body = { expenses: extraData.expenses };
        break;
      default:
        return;
    }

    try {
      const response = await fetch(API_BASE + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExpenseChange = (category, value) => {
    setExtraData(prev => ({
      ...prev,
      expenses: { ...prev.expenses, [category]: parseFloat(value) || 0 }
    }));
  };

  const expenseFields = {
    budget_summary: ["Food", "Transport"],
    spending_insights: ["Food", "Shopping"]
  };

  return (
    <div className="App" style={{ fontFamily: "Arial", padding: "20px", textAlign: "center" }}>
      <h1>💰 Personal Finance Chatbot</h1>

      {/* Function selection */}
      <div style={{ marginBottom: "20px" }}>
        {["nlu_analysis", "budget_summary", "qa", "spending_insights"].map(func => (
          <button
            key={func}
            onClick={() => {
              setSelectedFunction(func);
              setResult(null);
              setInputData("");
              setExtraData({ expenses: {} });
            }}
            style={{
              padding: "10px 20px",
              margin: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              border: selectedFunction === func ? "2px solid #007bff" : "1px solid #ccc",
              backgroundColor: selectedFunction === func ? "#007bff" : "#f0f0f0",
              color: selectedFunction === func ? "white" : "black",
              cursor: "pointer"
            }}
          >
            {func.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Inputs */}
      {["nlu_analysis", "qa"].includes(selectedFunction) && (
        <textarea
          rows="4"
          cols="60"
          placeholder={selectedFunction === "nlu_analysis" ? "Enter text to analyze..." : "Ask a financial question..."}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", display: "block", margin: "auto" }}
        />
      )}

      {selectedFunction === "budget_summary" && (
        <div>
          <input
            type="number"
            placeholder="Enter monthly income"
            onChange={(e) => setExtraData({ ...extraData, income: e.target.value })}
            style={{ padding: "10px", marginBottom: "10px", width: "300px" }}
          />
        </div>
      )}

      {["budget_summary", "spending_insights"].includes(selectedFunction) && (
        <div>
          {expenseFields[selectedFunction].map(category => (
            <div key={category} style={{ marginBottom: "10px" }}>
              <input
                type="number"
                placeholder={`${category} expenses`}
                onChange={(e) => handleExpenseChange(category, e.target.value)}
                style={{ padding: "10px", width: "300px" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Get Result
      </button>

      {/* Error */}
      {error && <div style={{ color: "red", marginTop: "15px" }}><strong>Error:</strong> {error}</div>}

      {/* Result */}
      {result && (
        <div style={{
          margin: "20px auto",
          maxWidth: "600px",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          textAlign: "center",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
        }}>
          <h2>Result</h2>
          <pre style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
