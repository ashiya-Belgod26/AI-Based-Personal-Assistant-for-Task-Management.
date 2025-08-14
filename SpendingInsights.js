import React, { useState } from "react";

function SpendingInsights() {
  const [expenses, setExpenses] = useState({});
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");

  const handleExpenseChange = (e, category) => {
    setExpenses({ ...expenses, [category]: e.target.value });
  };

  const getInsights = async () => {
    setError("");
    setInsights(null);

    if (Object.keys(expenses).length === 0) {
      setError("Please enter at least one expense.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/spending-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "error") {
        setError(result.message);
      } else {
        setInsights(result);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>📊 Spending Insights</h2>

      <div style={{ marginBottom: "15px" }}>
        <h4>Enter your expenses:</h4>
        {["Rent", "Food", "Transport", "Entertainment", "Other"].map((category) => (
          <div key={category} style={{ margin: "5px 0" }}>
            <input
              type="number"
              placeholder={category}
              value={expenses[category] || ""}
              onChange={(e) => handleExpenseChange(e, category)}
              style={{ padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", width: "200px" }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={getInsights}
        style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Get Insights
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "15px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {insights && (
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
          }}
        >
          <h3>Insights</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(insights, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default SpendingInsights;
