import React, { useState } from 'react';

export default function Login({onLoginSuccess}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        fetch(`http://localhost:8000/login?username=${email}&password=${password}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            if(data.success){
                onLoginSuccess()
            }

            
        })
        .catch((err) => {
            console.error("Failed to get bot response:", err)
            return "error"
        })
    }



    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}