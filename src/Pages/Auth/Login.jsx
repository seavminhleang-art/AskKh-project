import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCredentials } from '@/redux/slices/authSlice'
import Button from '@/Components/Admin/common/Button'

// Minimal login screen so /admin routes have somewhere to redirect to.
// Wire this up to the real auth endpoint when it's confirmed in the spec.
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(setCredentials({ accessToken: 'mock-access-token', admin: { name: 'Admin User', email: email || 'admin@askkh.io' } }))
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl border border-gray-100  p-6 animate-fade-slide">
        <div className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center font-bold mb-4">A</div>
        <h1 className="text-lg font-semibold text-gray-900">Sign in to Ask-Kh Admin</h1>
        <p className="text-sm text-gray-500 mt-1 mb-5">Manage users, posts, and moderation.</p>
        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full mb-4 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          placeholder="admin@askkh.io"
        />
        <label className="block text-sm text-gray-600 mb-1">Password</label>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full mb-5 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          placeholder="••••••••"
        />
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </div>
  )
}
