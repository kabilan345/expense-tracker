import { useState, useRef } from "react";

const icons = {
  Food: "🍴",
  Travel: "🚗",
  Shopping: "🛒",
  Other: "📦",
  Entertainment: "🎬",
  Bills: "💡"
};

export default function Transactions({ transactions, deleteEntry, editEntry }) {

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [swiped, setSwiped] = useState(null);
  const startX = useRef(0);
  const currentX = useRef(0);

  const grouped = {};
  transactions.forEach(t => {
    if (!grouped[t.day]) grouped[t.day] = [];
    grouped[t.day].push(t);
  });

  const days = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3>Recent Transactions</h3>
      

      {days.map(day => (
        <div key={day} style={{ marginBottom: 15 }}>
          <h4 className="txn-date">📅 {day}</h4>

          {grouped[day].map((t, i) => {
            const key = `${day}-${i}`;
            const isEditing = editing === key;
            const isSwiped = swiped === key;

            return (
              <div
                key={i}
                className={`txn-container ${isSwiped ? "swiped" : ""}`}
                onTouchMove={(e) => {
  currentX.current = e.touches[0].clientX;
  const diff = startX.current - currentX.current;

  // LEFT SWIPE (open)
if (diff > 0 && diff < 100) {
  e.currentTarget.style.transform = `translateX(-${diff}px)`;
}

// RIGHT SWIPE (close)
if (diff < 0 && Math.abs(diff) < 100) {
  e.currentTarget.style.transform = `translateX(${Math.abs(diff)}px)`;
}
}}

onTouchEnd={(e) => {
  const diff = startX.current - currentX.current;

  // SWIPE LEFT → OPEN
  if (diff > 60) {
    setSwiped(key);
    e.currentTarget.style.transform = "translateX(-80px)";
  }

  // SWIPE RIGHT → CLOSE
  else if (diff < -40) {
    setSwiped(null);
    e.currentTarget.style.transform = "translateX(0)";
  }

  // SMALL MOVE → RESET
  else {
    e.currentTarget.style.transform = isSwiped
      ? "translateX(-80px)"
      : "translateX(0)";
  }
}}
              >

                {isEditing ? (
                  <div className="txn-edit">

                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                    >
                      <option value="expense">Expense</option>
                      <option value="credit">Credit</option>
                    </select>

                    <input
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      placeholder="Amount"
                    />

                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      <option>Food</option>
                      <option>Travel</option>
                      <option>Shopping</option>
                      <option>Entertainment</option>
                      <option>Bills</option>
                      <option>Other</option>
                    </select>

                    <input
                      value={form.note}
                      onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                      }
                      placeholder="Note"
                    />

                    <button
                      onClick={() => {
                        editEntry(day, i, {
                          ...form,
                          amount: Number(form.amount)
                        });
                        setEditing(null);
                      }}
                    >
                      💾
                    </button>

                    <button onClick={() => setEditing(null)}>❌</button>

                  </div>
                ) : (
                  <>
                    {/* MAIN CONTENT */}
                    <div className="txn-content">
                      <div>
                        {icons[t.category]} ₹{t.amount}
                        <div className="txn-note">
                          {t.category} - {t.note}
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="txn-actions">
                      <button
                        onClick={() => {
                          setEditing(key);
                          setForm(t);
                        }}
                      >
                        ✏️
                      </button>

                      <button onClick={() => deleteEntry(day, i)}>
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}