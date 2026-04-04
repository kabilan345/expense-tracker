import { useState } from "react";

export default function AddEntryModal({
  isOpen,
  onClose,
  onAdd,
  month,
  date
}) {

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    note: ""
  });

  const [selectedDate, setSelectedDate] = useState(date);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.amount) return;

    onAdd({
      ...form,
      amount: Number(form.amount),
      date: selectedDate
    });

    setForm({
      type: "expense",
      amount: "",
      category: "Food",
      note: ""
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>

      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >

        <h3>Add Entry</h3>

        {/* 🔥 ROW 1 */}
        <div className="modal-row">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="expense">Expense</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        {/* 🔥 ROW 2 */}
        <div className="modal-row">
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
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
            <option>Other</option>
          </select>
        </div>

        {/* 🔥 NOTE FIELD */}
        <input
          placeholder="Note"
          value={form.note}
          onChange={(e) =>
            setForm({ ...form, note: e.target.value })
          }
        />

        {/* 🔥 ACTION BUTTONS */}
        <div className="modal-actions">
          <button className="btn-success" onClick={handleSubmit}>
            Add
          </button>
          <button className="btn-glass" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}