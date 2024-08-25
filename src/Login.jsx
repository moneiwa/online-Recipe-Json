
import React, { useState } from 'react';
import './index.css';

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Fetch users from json-server
      const response = await fetch('http://localhost:3000/user');
      const users = await response.json();

      // Find a matching user
      const user = users.find(user => user.name === name && user.password === password);

      if (user) {
        alert("We're logging in now ...");
        onLogin();
        window.location.href = '/'; // Redirect to home
      } else {
        alert("Invalid username or password");
      }
    } catch (err) {
      console.error('Login Failed:', err.message);
      setError('Login Failed: ' + err.message); // Display error to user if needed
    }
  };

  return ( 
    <div className='bg-img'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            
            <input 
              type="text" 
              placeholder='Username' 
              value={name}
              onChange={e => setName(e.target.value)} 
            />
          </div>
          <div className='input-box'>
            <input 
              type="password" 
              placeholder='Password' 
              value={password}
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className='forgot'>Forgot password?</a>
          </div>
          <button type='submit' className='log-btn'>Login</button>
        </form>
        <button className='reg' onClick={() => window.location.href = '/Register'}>
          Don't have an account? Register
        </button>
        {error && <p className="error">{error}</p>} {/* Display error message if any */}
      </div>
    </div>
  );
};

export default Login;
