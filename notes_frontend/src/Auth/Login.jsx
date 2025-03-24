import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleUsernameInput = (e) => {
        setUsername(e);
    }

    const handlePasswordInput = (e) => {
        setPassword(e);
    }

    const handleLogin = async () => {

        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                auth: {
                    username: username,
                    password: password
                }
            });

            console.log("Response: ", res.data);
            
            localStorage.setItem("JWT", res.data.Jwt);

            navigate("/notes"); 

        } catch (e) {
            console.log("Error is: ", e);
            alert("Login failed! Please check your credentials.");
        }

        
    }

    const handleTogglePassword = () => {

        const passwordTag = document.getElementById("password");
        const toggleButton = document.getElementById("togglePassword");


        if (passwordTag.type === "password"){
            passwordTag.type = "text";
            toggleButton.textContent = "hide";
        }
        else if(passwordTag.type === "text"){
            
            passwordTag.type = "password";
            toggleButton.textContent = "show";
        }

    }

  return (
    <div>
        <div>
            <input type='text' id='username' placeholder="Enter Username" value={username} onChange={(e)=>handleUsernameInput(e.target.value)}></input>

            <div>
                <input type='password' id="password" placeholder="Enter password"  value={password} onChange={(e)=>handlePasswordInput(e.target.value)}></input>
                <button type='button' id='togglePassword' onClick={handleTogglePassword}> show </button>
            </div>
        </div>

        <div>
            <button type='submit' onClick={handleLogin}> Login</button>
        </div>

        
      
    </div>
  );
};

export default Login;