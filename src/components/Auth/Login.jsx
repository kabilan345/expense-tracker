import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';
// import logo from '../../assets/logo.png';

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);

      toast.success("🚀 Login successful! Redirecting to home...", {
        position: "top-center",
        autoClose: 2000,
        transition: Zoom,
        theme: "colored",
      });

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      toast.error("Login failed: " + error.message, {
        position: "top-center",
        transition: Zoom,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="auth-page login-container">
      <div className="login-glass fade-in">
        {/* <img src={logo} alt="Logo" className="logo-spin" /> */}
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-quote">“Every great dream begins with a dreamer.”</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
  <FaLock className="icon" />

  <input
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    onChange={handleChange}
    required
  />

  <span
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-redirect">
          Don’t have an account?{' '}
          <span className="register-link" onClick={() => navigate('/register')}>
            Register here
          </span>
        </p>
      </div>
      <ToastContainer />
    </div>
    </>
  );
};

export default Login;
