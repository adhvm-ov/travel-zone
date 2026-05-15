import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // تأكد من الرابط الصحيح للسيرفر
        axios.post('https://travel-zone-seven.vercel.app/login', { email, password })
        .then(res => {
            if (res.data.message === "Success") {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate('/dashboard'); 
            }
        })
        .catch(err => {
            console.error(err);
            alert("فشل تسجيل الدخول: " + (err.response?.data?.message || "خطأ في الاتصال"));
        });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1a202c' }}>
            <form onSubmit={handleSubmit} style={{ background: '#2d3748', padding: '2rem', borderRadius: '8px', width: '300px' }}>
                <h2 style={{ color: 'white', textAlign: 'center' }}>منطقة السفر</h2>
                <input type="email" placeholder="الايميل" style={{ width: '100%', marginBottom: '10px', padding: '10px' }} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="كلمة السر" style={{ width: '100%', marginBottom: '20px', padding: '10px' }} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#00b5d8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>تسجيل الدخول</button>
            </form>
        </div>
    );
}

export default Login;