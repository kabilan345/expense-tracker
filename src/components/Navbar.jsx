export default function Navbar() {
  return (
    <div className="navbar">

      {/* LEFT */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <div
          style={{
            width: 28,
            height: 28,
            background: "var(--accent)",
            borderRadius: 8
          }}
        />
        <strong style={{ color: "var(--text-primary)" }}>
          Expense Tracker
        </strong>
      </div>

      {/* CENTER */}
      <div className="nav-links">
        <div className="nav-item active">Dashboard</div>
        <div className="nav-item">Expenses</div>
        <div className="nav-item">Summary</div>
        <div className="nav-item">Settings</div>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--text-secondary)" }}>
        ⚙️ 🔔
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600
          }}
        >
          K
        </div>
      </div>

    </div>
  );
}