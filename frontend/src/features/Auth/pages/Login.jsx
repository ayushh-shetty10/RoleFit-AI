import React, { useState } from "react";
import "../pages/Login_Register.scss"
import { Link, useNavigate } from 'react-router';
import { useAuth } from "../hooks/useAuth";
const Login = () => {

  const navigate = useNavigate();
    //2-way binding.
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const {loading,handleLogin}=useAuth();

    const handleSubmit = async (e)=>{
      e.preventDefault();
      handleLogin({email,password});
      navigate("/");
    }

    if(loading){
      return <main>
        <h1>Loading.....</h1>
      </main>
    }

  return (
    <main>
      <div className="main-grp">
        <h1>LOGIN</h1>

        <form className="form-container" onSubmit={handleSubmit}>
        <div className="input-grp">
          <label htmlFor="email">Email</label>
          <input onChange={(e)=>{setEmail(e.target.value)}}
            type="text"
            id="email"
            placeholder="Enter your email."
          />
        </div>
        <div className="input-grp">
          <label htmlFor="password">Password</label>
          <input onChange={(e)=>{setPassword(e.target.value)}}
            type="password"
            id="password"
            placeholder="Enter password"
          />
        </div>

        <button className="primary-btn" type="submit">Login</button>
        </form>

        <p>Don't have an account? <Link to={"/register"}>Register here</Link></p>
      </div>
    </main>
  );
};

export default Login;
