import React, { useState } from 'react';
import { login, signup } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e){
    e.preventDefault();
    await login(email, password);
    navigate("/");
  }

  async function handleSignup(e){
    e.preventDefault();
    await signup({ name: "User", email, password, password_confirmation: password });
    navigate("/");
  }

  return (
    <div className="container">
      <h2>Login / Signup</h2>

      <form>
        <label>Email</label><br/>
        <input value={email} onChange={e=>setEmail(e.target.value)} /><br/><br/>

        <label>Password</label><br/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/><br/>

        <button className="button" onClick={handleLogin}>Login</button>
        <button className="button" style={{marginLeft:8}} onClick={handleSignup}>Signup</button>
      </form>
    </div>
  );
}
