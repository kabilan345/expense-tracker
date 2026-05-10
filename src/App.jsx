import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import BalanceCard from "./components/BalanceCard";
import SummaryCard from "./components/SummaryCard";
import Transactions from "./components/Transactions";
import AddEntryModal from "./components/AddEntryModal";
import Toast from "./components/Toast";
import "./App.css";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";

function App() {

  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const userId = user?.uid;
  const [data, setData] = useState({});
  const [salaryData, setSalaryData] = useState({});
  const [salaryInput, setSalaryInput] = useState("");
  const [savingSalary, setSavingSalary] = useState(false);
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");


  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [hideToast, setHideToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [monthly, setMonthly] = useState({
    expense: 0,
    balance: 0,
    categories: {}
  });

useEffect(() => {
  if (!loading && !user) {
    navigate("/login");
  }
}, [user, loading, navigate]);

useEffect(() => {
  if (salaryData[month]?.amount !== undefined) {
    setSalaryInput(salaryData[month].amount);
  } else {
    setSalaryInput("");
  }
}, [month, salaryData]);


  // 📦 Load Data
  useEffect(() => {

    const today = new Date();
    setMonth(today.toISOString().slice(0, 7));
    setDate(today.toISOString().slice(0, 10));
  }, []);

  // 💾 Fetch Data from database
useEffect(() => {

  if (!userId) return; // 🚨 IMPORTANT

  const fetchData = async () => {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "transactions")
    );

    const newData = {};

    querySnapshot.forEach((docSnap) => {
      const d = docSnap.data();

      if (!newData[d.month]) newData[d.month] = {};
      if (!newData[d.month][d.day]) newData[d.month][d.day] = [];

      newData[d.month][d.day].push({
        type: d.type,
        amount: d.amount,
        category: d.category,
        note: d.note,
        id: docSnap.id
      });
    });

    setData(newData);
  };

  const fetchSalary = async () => {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "salary")
    );

    const salaryObj = {};

    querySnapshot.forEach((docSnap) => {
      const d = docSnap.data();

      salaryObj[docSnap.id] = {
        amount: d.amount
      };
    });

    setSalaryData(salaryObj);
  };

Promise.all([fetchData(), fetchSalary()])
    .finally(() => setIsFetching(false));

}, [userId]);

// 📊 Monthly Calculation
useEffect(() => {
  const days = data[month] || {};

  let totalExpense = 0;
  let totalCredit = 0;
  let balance = salaryData[month]?.amount || 0;
  let expenseCat = {};  // sum of all expenses per category
  let creditCat = {};   // sum of all credits per category

  // STEP 1: Collect expenses and credits separately
  Object.values(days).forEach(entries => {
    entries.forEach(e => {
      if (e.type === "expense") {
        totalExpense += e.amount;
        expenseCat[e.category] = (expenseCat[e.category] || 0) + e.amount;
        balance -= e.amount;
      } else {
        totalCredit += e.amount;
        creditCat[e.category] = (creditCat[e.category] || 0) + e.amount;
        balance += e.amount;
      }
    });
  });

  // STEP 2: Net each category (expense - credit), minimum 0
  const cat = {};
  Object.keys(expenseCat).forEach(k => {
    const net = expenseCat[k] - (creditCat[k] || 0);
    if (net > 0) cat[k] = net;
  });

  // STEP 3: Net total expense shown = totalExpense - totalCredit, minimum 0
  const netExpense = Math.max(0, totalExpense - totalCredit);

  setMonthly({
    expense: netExpense,
    balance,
    categories: cat
  });

}, [data, month, salaryData]);

// ⏳ Loading
if (loading || !month || !date) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "var(--bg-primary)",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px"
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: "4px solid rgba(255,255,255,0.2)",
        borderTop: "4px solid var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ color: "var(--text-secondary)", fontSize: "15px", margin: 0 }}>
        Loading your data...
      </p>
    </div>
  );
}

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
  let running = salaryData[month]?.amount || 0;

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
const handleAddEntry = async (entry) => {
  setIsProcessing(true);
  try {
    const day = entry.date.split("-")[2];
    const docRef = await addDoc(collection(db, "users", userId, "transactions"), {
      type: entry.type,
      amount: entry.amount,
      category: entry.category,
      note: entry.note,
      month: month,
      day: day
    });
    const newData = structuredClone(data);
    if (!newData[month]) newData[month] = {};
    if (!newData[month][day]) newData[month][day] = [];
    newData[month][day].push({
      type: entry.type,
      amount: entry.amount,
      category: entry.category,
      note: entry.note,
      id: docRef.id
    });
    setData(newData);
    showToast("Entry Added", "success");
  } finally {
    setIsProcessing(false);
  }
};

  // 🗑️ Delete Entry
const deleteEntry = async (day, index) => {
  setIsProcessing(true);
  try {
    const entry = data[month][day][index];
    await deleteDoc(doc(db, "users", userId, "transactions", entry.id));
    const newData = structuredClone(data);
    newData[month][day].splice(index, 1);
    setData(newData);
    showToast("Entry Deleted", "error");
  } finally {
    setIsProcessing(false);
  }
};

  // ✏️ Edit Entry
const editEntry = async (day, index, updatedEntry) => {
  setIsProcessing(true);
  try {
    const entry = data[month][day][index];
    await updateDoc(doc(db, "users", userId, "transactions", entry.id), {
      ...updatedEntry
    });
    const newData = structuredClone(data);
    newData[month][day][index] = {
      ...updatedEntry,
      id: entry.id
    };
    setData(newData);
    showToast("Entry Updated", "warning");
  } finally {
    setIsProcessing(false);
  }
};

return (
  <div className="app">

    {/* GLOBAL LOADING OVERLAY */}
    {(isProcessing || isFetching) && (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px"
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: "4px solid rgba(255,255,255,0.2)",
          borderTop: "4px solid var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <p style={{ color: "white", fontSize: "15px", margin: 0 }}>
          Please wait...
        </p>
      </div>
    )}

    {/* NAVBAR */}
    <Navbar />

      {/* HEADER */}
      <div className="header">

        <div>
          <h2 style={{ margin: 0 }}>Hello, {user?.displayName} 👋</h2>
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
  value={salaryInput}
  onChange={(e) => {
    const value = e.target.value;
    if (value >= 0) {
      setSalaryInput(value);
    }
  }}
/>

<button
  className="btn-glass"
  disabled={savingSalary}
  onClick={async () => {

    if (!salaryInput) {
      showToast("Enter salary first", "error");
      return;
    }

    setSavingSalary(true); // ✅ START LOADING

    const value = Number(salaryInput);

    await setDoc(doc(db, "users", userId, "salary", month), {
      amount: value
    });

    setSalaryData({
      ...salaryData,
      [month]: { amount: value }
    });

    showToast("Salary Updated", "success");

    setSavingSalary(false); // ✅ STOP LOADING
  }}
>
  {savingSalary ? "Saving..." : "💾 Save Salary"}
</button>

          <button
            className="btn-success"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Entry
          </button>

        </div>
      </div>

      {/* DASHBOARD */}
      <div className="dashboard">

        <BalanceCard
  salary={salaryData[month]?.amount || 0}
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