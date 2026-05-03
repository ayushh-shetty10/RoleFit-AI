import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
   const navigate = useNavigate();

  const [email,setEmail]= useState("");
  const [username,setUsername]= useState("");
  const [password,setPassword]= useState("");
  const {loading,handleRegister}=useAuth();
  

    const handleSubmit = (e)=>{
      e.preventDefault();
      handleRegister({email,username,password});
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
        <h1>Register</h1>

        <form className="form-container" onSubmit={handleSubmit}>
        <div className="input-grp">
          <label htmlFor="email/username">Email</label>
          <input
            type="email"
            onChange = {(e)=>setEmail(e.target.value)}
            id="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="input-grp">
          <label htmlFor="username">Username</label>
          <input
          onChange = {(e)=>setUsername(e.target.value)}
            type="text"
            id="username"
            placeholder="Enter your username"
          />
        </div>
        <div className="input-grp">
          <label htmlFor="password">Password</label>
          <input
          onChange = {(e)=>setPassword(e.target.value)}
            type="password"
            id="email/username"
            placeholder="Enter password"
          />
        </div>

        <button className="login-btn" type="submit">Register</button>
        </form>

        <p>Already Registered? <Link to={"/login"}>Login</Link></p>
      </div>
    </main>
  );
}

export default Register