import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex gap-6">
      <h1 className="font-bold text-lg mr-auto">Quản Lý Sinh Viên</h1>
      <Link to="/" className="hover:underline">Sinh Viên</Link>
    </nav>
  )
}

export default Navbar