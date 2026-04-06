import { useAuth } from "../Context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

  // 🌗 Theme state
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setShowProfile(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

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
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>

        {/* PROFILE */}
        <div className="profile-section" ref={profileRef}>

  <img
    src={user?.photoURL}
    alt="profile"
    className="profile-img"
    onClick={() => setShowProfile(!showProfile)}
  />

  <div className={`profile-dropdown ${showProfile ? "open" : "close"}`}>

    <p><strong>{user?.displayName}</strong></p>
    <p style={{ fontSize: "13px", opacity: 0.7 }}>
      {user?.email}
    </p>

    <hr className="dropdown-divider" />

    <button onClick={toggleTheme} className="dropdown-btn">
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>

    <button onClick={logout} className="dropdown-btn logout">
      🚪 Logout
    </button>

  </div>

</div>

      </div>

    </div>
  );
}