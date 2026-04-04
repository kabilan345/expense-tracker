import SummaryCard from "./SummaryCard";
import BalanceCard from "./BalanceCard";
import Transactions from "./Transactions";

export default function Dashboard() {
  return (
    <>
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 20
      }}>
        <div>
          <h2>Hello, Kabilan 👋</h2>
          <p className="label">Track your expenses smartly</p>
        </div>

        <div className="primary-btn">➕ Add Entry</div>
      </div>

      {/* GRID */}
      <div className="dashboard">
        <BalanceCard />
        <SummaryCard />
      </div>

      <Transactions />
    </>
  );
}