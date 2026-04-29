import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

function LoginPage() {
  const [tenDangNhap, setTenDangNhap] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [loi, setLoi] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5001/api/user/login', {
        TENDANGNHAP: tenDangNhap,
        MATKHAU: matKhau
      })
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.data))
        navigate('/')
      }
    } catch (err) {
      setLoi(err.response?.data?.message || 'Đăng nhập thất bại!')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Quản Lý Sinh Viên
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={tenDangNhap}
              onChange={e => setTenDangNhap(e.target.value)}
              placeholder="Nhập tên đăng nhập..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={matKhau}
              onChange={e => setMatKhau(e.target.value)}
              placeholder="Nhập mật khẩu..."
            />
          </div>
          {loi && <p className="text-red-500 text-sm mb-4">{loi}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage