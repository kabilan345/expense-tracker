export default function Toast({ message, type, hide }) {

  const icons = {
    success: "✅",
    error: "❌",
    warning: "✏️"
  };

  return (
    <div className={`toast ${type} ${hide ? "hide" : ""}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}