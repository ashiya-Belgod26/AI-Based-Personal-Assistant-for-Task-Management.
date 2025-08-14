import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>💰 Personal Finance Chatbot</h1>
        <p>Intelligent Guidance for Savings, Taxes, and Investments</p>
        <p>Select one of the functions below:</p>

        <div className="button-grid">
          <button type="button" onClick={() => goTo("/nlu-analysis")}>
            🔍 NLU Analysis
          </button>
          <button type="button" onClick={() => goTo("/qa")}>
            💬 Q&A
          </button>
          <button type="button" onClick={() => goTo("/budget-summary")}>
            🔥 Budget Summary
          </button>
          <button type="button" onClick={() => goTo("/spending-insights")}>
            📊 Spending Insights
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
