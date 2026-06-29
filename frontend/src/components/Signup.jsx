import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import Sphere from "../components/Sphere";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const response = await axios.post(
        "https://speakquest-backend.onrender.com/api/auth/login",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      alert(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      alert(
        error.response?.data?.message || "Signup Failed"
      );
    }
  };

  return (
    <div className="page">
      <div className="navbar">
        <Navbar />
      </div>

      <div className="container">
        <div className="About">
          <div className="sphere">
            <Sphere />
          </div>

          <div className="intro">
            <h1 className="title">
              Improve Your English <br />
              With <span className="ai-text">AI</span>
            </h1>

            <p className="sub">
              Practice Speaking naturally, get real-time feedback,
              <br />
              and track your fluency, pronunciation,
              <br />
              and grammar.
            </p>

            <br />

            <div className="features">
              <div className="feature-card">
                <div className="icon-box">🎙️</div>
                <p>
                  Real-time
                  <br />
                  Feedback
                </p>
              </div>

              <div className="feature-card">
                <div className="icon-box">📈</div>
                <p>
                  Track Your
                  <br />
                  Progress
                </p>
              </div>

              <div className="feature-card">
                <div className="icon-box">🎤</div>
                <p>
                  Speak with
                  <br />
                  Confidence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Signup Form */}

        <div className="signup-card">
          <h1>Create Account</h1>

          <p className="subtitle">
            Join SpeakQuest and start improving your English today.
          </p>

          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            className="signup-btn"
            onClick={handleSignup}
          >
            Sign Up
          </button>

          <p className="signup-text">
            Already have an account?{" "}
            <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;