import { Link, useNavigate } from 'react-router'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
      <h1 className="font-bold text-xl">Quản Lý Sinh Viên</h1>
      <div className="flex gap-6 items-center">
        {user ? (
          <>
            <Link to="/" className="hover:underline">Trang Chủ</Link>
            <Link to="/sinhvien" className="hover:underline">Sinh Viên</Link>
            <span className="text-sm">Xin chào, {user.TENDANGNHAP}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Đăng Xuất
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">Đăng Nhập</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar