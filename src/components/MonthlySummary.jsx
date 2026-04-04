import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function MonthlySummary({ monthly }) {

  const total = monthly.balance + monthly.expense;
  const percent = total > 0 ? (monthly.expense / total) * 100 : 0;

  return (
    <div className="card">

      {/* 🔥 METRIC CARDS */}
      <div className="grid">

        <div className="metric-card">
          <p>Total Expense</p>
          <h2 className="negative">₹{monthly.expense}</h2>
        </div>

        <div className="metric-card">
          <p>Balance</p>
          <h2 className={monthly.balance >= 0 ? "positive" : "negative"}>
            ₹{monthly.balance}
          </h2>
        </div>

      </div>

      {/* 🔥 PROGRESS BAR */}
      <div style={{ marginTop: "15px" }}>
        <p style={{ fontSize: "14px" }}>Budget Usage</p>

        <div style={{
          height: "8px",
          background: "#ddd",
          borderRadius: "10px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${percent}%`,
            background: percent > 70 ? "#ef4444" : "#22c55e",
            height: "100%",
            transition: "0.4s"
          }} />
        </div>
      </div>

      {/* 🔥 PIE CHART */}
      {Object.keys(monthly.categories).length > 0 && (
        <div className="chart-container">
        <Pie
          data={{
            labels: Object.keys(monthly.categories),
            datasets: [
              {
                data: Object.values(monthly.categories),
                backgroundColor: [
                  "#6366f1",
                  "#22c55e",
                  "#f59e0b",
                  "#ef4444"
                ]
              }
            ]
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    `${ctx.label}: ₹${ctx.raw}`
                }
              }
            }
          }}
        />
        </div>
      )}

    </div>
  );
}