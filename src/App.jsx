import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import BalanceCard from "./components/BalanceCard";
import SummaryCard from "./components/SummaryCard";
import Transactions from "./components/Transactions";
import AddEntryModal from "./components/AddEntryModal";
import Toast from "./components/Toast";
import "./App.css";

function App() {

  const [data, setData] = useState({});
  const [salaryData, setSalaryData] = useState({});
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");

  // 🌗 THEME STATE
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [hideToast, setHideToast] = useState(false);

  const [monthly, setMonthly] = useState({
    expense: 0,
    balance: 0,
    categories: {}
  });

  // 🌗 APPLY THEME
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 📦 Load Data
  useEffect(() => {
    setData(JSON.parse(localStorage.getItem("expenseData")) || {});
    setSalaryData(JSON.parse(localStorage.getItem("salaryData")) || {});

    const today = new Date();
    setMonth(today.toISOString().slice(0, 7));
    setDate(today.toISOString().slice(0, 10));
  }, []);

  // 💾 Save Data
  useEffect(() => {
    localStorage.setItem("expenseData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("salaryData", JSON.stringify(salaryData));
  }, [salaryData]);

  // 📊 Monthly Calculation
  useEffect(() => {
    const days = data[month] || {};

    let total = 0;
    let balance = salaryData[month] || 0;
    let cat = {};

    Object.values(days).forEach(entries => {
      entries.forEach(e => {
        if (e.type === "expense") {
          total += e.amount;
          cat[e.category] = (cat[e.category] || 0) + e.amount;
          balance -= e.amount;
        } else {
          balance += e.amount;
        }
      });
    });

    setMonthly({
      expense: total,
      balance,
      categories: cat
    });

  }, [data, month, salaryData]);

  // ⏳ Loading
  if (!month || !date) return <div>Loading...</div>;

  const monthData = data[month] || {};

  // 📋 Transactions
  let transactions = [];

  Object.keys(monthData).forEach(day => {
    monthData[day].forEach((entry, index) => {
      transactions.push({
        day,
        index,
        ...entry
      });
    });
  });

  transactions = transactions.sort((a, b) => Number(b.day) - Number(a.day));

  // 📈 Balance Trend
  const balanceTrend = [];
  let running = salaryData[month] || 0;

  const sortedDays = Object.keys(monthData).sort(
    (a, b) => Number(a) - Number(b)
  );

  sortedDays.forEach(d => {
    const entries = monthData[d];

    entries.forEach(e => {
      if (e.type === "expense") running -= e.amount;
      else running += e.amount;
    });

    balanceTrend.push({
      day: d,
      balance: running
    });
  });

  // 🔔 Toast helper
const showToast = (msg, type = "success") => {
  setToast({ message: msg, type });
  setHideToast(false);

  // Start fade-out after 2s
  setTimeout(() => {
    setHideToast(true);
  }, 2000);

  // Remove after animation completes
  setTimeout(() => {
    setToast(null);
  }, 2400);
};

  // ➕ Add Entry
  const handleAddEntry = (entry) => {
    const day = entry.date.split("-")[2];

    const newData = structuredClone(data);

    if (!newData[month]) newData[month] = {};
    if (!newData[month][day]) newData[month][day] = [];

    newData[month][day].push({
      type: entry.type,
      amount: entry.amount,
      category: entry.category,
      note: entry.note
    });

    setData(newData);
    showToast("Entry Added", "success");
  };

  // 🗑️ Delete Entry
  const deleteEntry = (day, index) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[month][day].splice(index, 1);
    setData(newData);
    showToast("Entry Deleted", "error");
  };

  // ✏️ Edit Entry
  const editEntry = (day, index, updatedEntry) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[month][day][index] = updatedEntry;
    setData(newData);
    showToast("Entry Updated", "warning");
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <Navbar />

      {/* HEADER */}
      <div className="header">

        <div>
          <h2 style={{ margin: 0 }}>Hello, Kabilan 👋</h2>
          <p style={{ color: "var(--text-secondary)" }}>{month}</p>
        </div>

        <div className="header-actions">

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          <input
            type="number"
            placeholder="Salary"
            value={salaryData[month] || ""}
            onChange={(e) =>
              setSalaryData({
                ...salaryData,
                [month]: Number(e.target.value)
              })
            }
          />

          <button
            className="btn-success"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Entry
          </button>

          <button
            className="btn-glass"
            onClick={() =>
              setTheme(prev => (prev === "dark" ? "light" : "dark"))
            }
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

        </div>
      </div>

      {/* DASHBOARD */}
      <div className="dashboard">

        <BalanceCard
  salary={salaryData[month] || 0}
  trend={balanceTrend}
  transactions={transactions}
/>

        <SummaryCard monthly={monthly} />

      </div>

      {/* TRANSACTIONS */}
      <Transactions
        transactions={transactions}
        deleteEntry={deleteEntry}
        editEntry={editEntry}
      />

      {/* MODAL */}
      <AddEntryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddEntry}
        month={month}
        date={date}
      />

      {/* TOAST */}
      {toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    hide={hideToast}
  />
)}

    </div>
  );
}

export default App;