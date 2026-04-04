export default function EntryList({ entries, editEntry, deleteEntry }) {
  return (
    <div className="card">
      <h3>📝 Entries</h3>
      {entries.map((e, i) => (
        <div key={i}>
          {e.type} ₹{e.amount} {e.category}
          <span className="entry-buttons">
            <button onClick={() => editEntry(i)}>Edit</button>
            <button onClick={() => deleteEntry(i)}>Delete</button>
          </span>
        </div>
      ))}
    </div>
  );
}