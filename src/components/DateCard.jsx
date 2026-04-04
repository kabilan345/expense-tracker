import { useState } from "react";

export default function DateCard({ date, entries, month, data, setData, summary }) {

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    note: ""
  });

  const [open, setOpen] = useState(true);

  // ✅ FIX: Define OUTSIDE JSX
  const categoryIcons = {
    Food: "🍴",
    Travel: "🚗",
    Shopping: "🛒",
    Other: "📦"
  };

  // ➕ Add Entry
  const addEntry = () => {
    if (!form.amount) return;

    const newData = JSON.parse(JSON.stringify(data));

    if (!newData[month]) newData[month] = {};
    if (!newData[month][date]) newData[month][date] = [];

    newData[month][date].push({
      ...form,
      amount: Number(form.amount)
    });

    setData(newData);
    setForm({ ...form, amount: "", note: "" });
  };

  // 🗑️ Delete (with confirm)
  const deleteEntry = (index) => {
    if (!window.confirm("Delete this entry?")) return;

    const newData = JSON.parse(JSON.stringify(data));
    newData[month][date].splice(index, 1);
    setData(newData);
  };

  // ✏️ Edit
  const editEntry = (index) => {
    const entry = entries[index];
    setForm(entry);
    deleteEntry(index);
  };

  return (
    <div className="card">

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: "16px" }}>📅 {date}</h3>

        <button onClick={() => setOpen(!open)}>
          {open ? "🔽" : "▶"}
        </button>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div style={{ marginBottom: "10px" }}>
          <p>Prev: ₹{summary.prevBalance}</p>

          <p className="negative">⬇ Expense: ₹{summary.expense}</p>
          <p className="credit">⬆ Credit: ₹{summary.credit}</p>

          <p className={summary.balance >= 0 ? "positive" : "negative"}>
            Balance: ₹{summary.balance}
          </p>
        </div>
      )}

      {/* COLLAPSIBLE CONTENT */}
      {open && (
        <div className={`card-content ${open ? "open" : ""}`}>

          {/* ENTRIES */}
          {entries.length === 0 ? (
            <p style={{ opacity: 0.6 }}>📭 No entries yet</p>
          ) : (
            entries.map((e, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid #eee"
                }}
              >
                <span>
                  {e.type === "expense" ? "🔻" : "🔺"} ₹{e.amount}{" "}
                  {categoryIcons[e.category]} ({e.category})
                </span>

                <span className="entry-buttons">
                  <button onClick={() => editEntry(i)}>Edit</button>
                  <button onClick={() => deleteEntry(i)}>Delete</button>
                </span>
              </div>
            ))
          )}

          {/* FORM */}
          <div style={{ marginTop: "10px" }}>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="credit">Credit</option>
            </select>

            <input
              autoFocus
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>

            <input
              placeholder="Note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />

            <button onClick={addEntry}>Add</button>
          </div>

        </div>
      )}

    </div>
  );
}