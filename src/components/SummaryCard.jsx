import { Doughnut } from "react-chartjs-2";

export default function SummaryCard({ monthly }) {

  return (
    <div className="card">

      <p className="label">Monthly Summary</p>

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

      <div style={{ height: 140 }}>
        <Doughnut
          data={{
            labels: Object.keys(monthly.categories),
            datasets: [{
              data: Object.values(monthly.categories),
              backgroundColor: ["#4a7fe8", "#e8a020", "#4fc97a"]
            }]
          }}
          options={{
            cutout: "70%",
            plugins: { legend: { display: false } }
          }}
        />
      </div>

    </div>
  );
}