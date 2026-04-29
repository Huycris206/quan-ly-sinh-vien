import { Link, useNavigate } from 'react-router'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
        </div>
        <span className="font-bold text-gray-800 text-lg tracking-tight">
          Quản Lý <span className="text-green-600">Sinh Viên</span>
        </span>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/" className="text-gray-500 hover:text-green-600 text-sm font-medium transition-colors">
              Trang Chủ
            </Link>
            <Link to="/sinhvien" className="text-gray-500 hover:text-green-600 text-sm font-medium transition-colors">
              Sinh Viên
            </Link>
            <Link to="/monhoc" className="text-gray-500 hover:text-green-600 text-sm font-medium transition-colors">
              Môn Học
            </Link>
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-semibold text-sm">
                  {user.TENDANGNHAP?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600">{user.TENDANGNHAP}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            Đăng Nhập
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar