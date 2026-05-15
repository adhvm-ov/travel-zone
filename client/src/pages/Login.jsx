import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    try {
      const res = await axios.post('https://travel-zone-seven.vercel.app/login', {
        email,
        password,
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      navigate('/dashboard')
    } catch (err) {
      alert('Login Failed')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-10 rounded-2xl w-[400px]">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Travel Zone
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg mb-4 text-black"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg mb-4 text-black"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-cyan-500 p-3 rounded-lg font-bold"
        >
          Login
        </button>
      </div>
    </div>
  )
}