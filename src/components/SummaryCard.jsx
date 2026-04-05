import { Doughnut } from "react-chartjs-2";

export default function SummaryCard({ monthly }) {

const total = Object.values(monthly.categories || {}).reduce((a, b) => a + b, 0);

const categoryList = Object.entries(monthly.categories || {}).map(([cat, val]) => ({
  category: cat,
  amount: val,
  percent: total ? Math.round((val / total) * 100) : 0
}));

const categoryColors = {
  Food: "#4a7fe8",
  Travel: "#e8a020",
  Shopping: "#4fc97a",
  Other: "#a78bfa",
  Entertainment: "#f472b6", 
  Bills: "#22d3ee"          
};

  return (
    <div className="card">

      <h3>Monthly Summary</h3>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>

        <div>
          <p className="label">Expense</p>
          <p className="value red">₹{monthly.expense}</p>
        </div>

        <div>
          <p className="label">Balance</p>
          <p className="value green">₹{monthly.balance}</p>
        </div>

      </div>

      <div className="summary-bottom">

  {/* LEFT → CHART */}
  <div className="summary-chart">
    <Doughnut
      data={{
        labels: Object.keys(monthly.categories),
        datasets: [{
          data: Object.values(monthly.categories),
          backgroundColor: Object.keys(monthly.categories).map(
  (cat) => categoryColors[cat] || "#888"
)
        }]
      }}
      options={{
        cutout: "70%",
        plugins: { legend: { display: false } }
      }}
    />
  </div>

  {/* RIGHT → CATEGORY LIST */}
  <div className="summary-categories">
    {categoryList.map((c, i) => (
      <div key={i} className="cat-row">
        <span
  className="cat-dot"
  style={{ background: categoryColors[c.category] }}
></span>
        <span>{c.category}</span>
        <span>₹{c.amount}</span>
        <span>{c.percent}%</span>
      </div>
    ))}
  </div>

</div>

    </div>
  );
}