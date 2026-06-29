import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css"
import Sphere from "../components/Sphere";
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
         });
    };
const handleLogin = async () => {
  try {
    
    const response = await axios.post(
      "https://speakquest-backend.onrender.com/api/auth/login",
      {
        email: formData.email,
        password: formData.password,
      }
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    navigate("/dashboard");

  } catch (error) {

    alert(
      error.response?.data?.message || "Login Failed"
    );

  }
};


  return (
    <div className="page">
        <div className="navbar">
            <Navbar/>
        </div>
        <div className="container">
            <div className='About'>
                <div className='sphere'>
                    <Sphere/>
                </div>
                <div className="intro">
                    <h1 className="title">Improve Your English <br/> With <span className="ai-text">AI</span></h1>
                    <p className = "sub">Practice Speaking naturally , get real-time feedback,<br/> and track your fluency ,pronunciation,<br/> and grammar. </p>

                    <br/>
                    <div className="features">
                        <div className="feature-card">
                            <div className="icon-box">🎙️</div>
                            <p>Real-time<br />Feedback</p>
                        </div>

                        <div className="feature-card">
                            <div className="icon-box">📈</div>
                            <p>Track Your<br />Progress</p>
                        </div>

                        <div className="feature-card">
                            <div className="icon-box">🎤</div>
                            <p>Speak with<br />Confidence</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* now login form */}
            <div className="login-card">
                <h1>Welcome Back</h1>

                <p className="subtitle">Login to continue your English fluency journey.</p>

                <div className="input-group"> 
                    <label>Email address</label>
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


                <button
                    className="login-btn"
                    onClick={handleLogin}
                >
                Login
                </button>   

                <p className="signup-text">
                    Don't have an account?{" "}
                    <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
        
    </div>
  )
}

export default LoginPage