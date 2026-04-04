import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function BalanceCard({ trend, salary }) {

  const labels = trend.map(t => `Day ${t.day}`);
  const values = trend.map(t => t.balance);

  return (
    <div className="card">

      <h3>Total Balance</h3>

      <h1 className="value">
        ₹{values.length ? values[values.length - 1] : salary}
      </h1>

      <div style={{ height: 260 }}>
        <Line
          data={{
            labels,
            datasets: [{
              data: values,
              borderColor: "#4a7fe8",
              fill: true,
              backgroundColor: "rgba(74,127,232,0.1)",
              tension: 0.4
            }]
          }}
          options={{
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  }
}}
        />
      </div>

    </div>
  );
}