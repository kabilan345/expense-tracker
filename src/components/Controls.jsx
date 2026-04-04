export default function Controls({ month, setMonth, date, setDate, salaryData, setSalaryData }) {
  return (
    <div className="card">
      <input type="month" value={month} onChange={e => setMonth(e.target.value)} />

      <input
        type="number"
        placeholder="Salary"
        value={salaryData[month] || ""}
        onChange={e =>
          setSalaryData({ ...salaryData, [month]: Number(e.target.value) })
        }
      />

      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
    </div>
  );
}