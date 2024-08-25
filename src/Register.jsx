import React, { useState } from 'react';

const Register = () => {

    
const [name, setName] = useState("");
const [password, setPassword] = useState("");

const handleSubmit = (event) => {
event.preventDefault();
let registration={name, password};
// const userData = { username: name, password: password };
// localStorage.setItem('userData', JSON.stringify(userData)); // Store data as JSON


fetch  ("http://localhost:3000/recipes",{
    method:"POST",
    headers:{'content-type':'application/json'},
 body:JSON.stringify(registration)

}).then ((res)=>{
alert('Registered successfully')
}).catch ((err)=>{
    console.error ('failed :'+err.message);
});
}


// window.location.href = '/login'; // Switch to logi

//ret....





return (
<div className='wrapper'>
<form onSubmit={handleSubmit}>

<h1>Register</h1>

<div className="input-box">
<input type="text" placeholder='Username' required onChange={e => setName(e.target.value)} />
</div>

<div className='input-box'>
<input type="password" placeholder='Password' required onChange={e => setPassword(e.target.value)} />
</div>

<div className="remember-forgot">
<label><input type="checkbox" /> Remember me</label>
</div>

<button className="log-btn" type='submit'>Register</button>
</form>

<button onClick={() => window.location.href = 'Login'}>Already have an account? Login</button>
</div>
);
};

export default Register;