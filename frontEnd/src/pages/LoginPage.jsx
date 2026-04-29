import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

function LoginPage() {
  const [tenDangNhap, setTenDangNhap] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [loi, setLoi] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
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
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-green-600 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
          </div>
          <span className="text-white font-bold text-xl">Quản Lý Sinh Viên</span>
        </div>
        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Hệ thống quản lý<br />hồ sơ sinh viên
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-green-500 rounded-2xl p-4 flex-1">
            <div className="text-white text-2xl font-bold">500+</div>
            <div className="text-green-100 text-sm">Sinh viên</div>
          </div>
          <div className="bg-green-500 rounded-2xl p-4 flex-1">
            <div className="text-white text-2xl font-bold">50+</div>
            <div className="text-green-100 text-sm">Môn học</div>
          </div>
          <div className="bg-green-500 rounded-2xl p-4 flex-1">
            <div className="text-white text-2xl font-bold">20+</div>
            <div className="text-green-100 text-sm">Ngành học</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
            <p className="text-gray-500">Chào mừng bạn quay trở lại!</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên đăng nhập
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                value={tenDangNhap}
                onChange={e => setTenDangNhap(e.target.value)}
                placeholder="Nhập tên đăng nhập..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                value={matKhau}
                onChange={e => setMatKhau(e.target.value)}
                placeholder="Nhập mật khẩu..."
              />
            </div>
            {loi && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                {loi}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage