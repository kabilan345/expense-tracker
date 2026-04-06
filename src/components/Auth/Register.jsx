import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import maleprofile from '../../assets/male.jpeg';
import femaleprofile from '../../assets/female.jpeg';
import './Register.css';
import { FaUser, FaEnvelope, FaLock, FaVenusMars } from 'react-icons/fa';
import { db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";


const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", gender: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.gender) {
      toast.error("Please fill in all fields including gender", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const avatarUrl = form.gender === 'male' ? maleprofile : femaleprofile;

      await updateProfile(userCred.user, {
        displayName: form.name,
        photoURL: avatarUrl
      });

await setDoc(doc(db, "users", userCred.user.uid), {
  name: form.name,
  email: form.email,
  photoURL: avatarUrl
});

      await signOut(auth);

      toast.success("🎉 Registered successfully! Redirecting to login...", {
        position: "top-center",
        autoClose: 2000,
        transition: Zoom,
        theme: "colored"
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        transition: Zoom,
        theme: "colored"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page register-container">
      <div className="register-glass">
        {/* <img src={logo} alt="Logo" className="logo-spin" /> */}
        <h2 className="title">Create Your Account</h2>
        <p className="quote">“The future belongs to those who prepare for it today.”</p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <FaUser className="icon" />
            <input name="name" placeholder="Name" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <FaVenusMars className="icon" />
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button className="submit-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-redirect">
          Already have an account?{' '}
          <span className="login-link" onClick={() => navigate('/login')}>
            Login here
          </span>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
