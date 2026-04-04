export default function EntryForm({ form, setForm, addEntry }) {
  return (
    <div className="card">
      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
        <option value="expense">Expense</option>
        <option value="credit">Credit</option>
      </select>

      <input
        value={form.amount}
        onChange={e => setForm({ ...form, amount: e.target.value })}
        placeholder="Amount"
      />

      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
        <option>Food</option>
        <option>Travel</option>
        <option>Shopping</option>
        <option>Other</option>
      </select>

      <input
        value={form.note}
        onChange={e => setForm({ ...form, note: e.target.value })}
        placeholder="Note"
      />

      <button onClick={addEntry}>Add Entry</button>
    </div>
  );
}