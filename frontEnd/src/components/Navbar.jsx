import { Link } from 'react-router'

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
      <h1 className="font-bold text-xl">Quản Lý Sinh Viên</h1>
      <div className="flex gap-6">
        <Link to="/" className="hover:underline">Trang Chủ</Link>
        <Link to="/sinhvien" className="hover:underline">Sinh Viên</Link>
      </div>
    </nav>
  )
}

export default Navbar