import React, { useState } from 'react';

const Register = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        
        if (!name) {
            setNameError("Username is required.");
            return;
        }

        if (passwordError) {
            return; 
        }

        const registration = { name, password };

        fetch("http://localhost:3000/recipes", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registration)
        })
        .then((res) => {
            alert('Registered successfully');
        })
        .catch((err) => {
            console.error('Failed: ' + err.message);
        });
    }

    const handlePasswordChange = (event) => {
        const passwordValue = event.target.value;
        setPassword(passwordValue);
        if (passwordValue.length < 6) {
            setPasswordError("Password must be at least 6 characters");
        } else {
            setPasswordError("");
        }
    }

    const handleNameChange = (event) => {
        const nameValue = event.target.value;
        setName(nameValue);
        setNameError(nameValue ? "" : "Username is required.");
    }

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder='Username'
                        required
                        onChange={handleNameChange}
                    />
                    {nameError && <div style={{ color: 'red' }}>{nameError}</div>}
                </div>
                <div className='input-box'>
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        required
                        onChange={handlePasswordChange}
                    />
                    {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
                </div>
                <div className="remember-forgot">
                    <label><input type="checkbox" /> Remember me</label>
                </div>
                <button className="log-btn" type='submit'>Register</button>
            </form>
            <button onClick={() => window.location.href = 'Login'}>
                Already have an account? Login
            </button>
        </div>
    );
};

export default Register;
