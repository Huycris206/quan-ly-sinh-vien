import { useEffect, useState } from 'react'
import { getAllSinhVien } from '../services/sinhVienService'

function SinhVien() {
  const [danhSach, setDanhSach] = useState([])

  useEffect(() => {
    getAllSinhVien()
      .then(data => setDanhSach(data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh Sách Sinh Viên</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border p-2">Mã SV</th>
            <th className="border p-2">Họ Tên</th>
            <th className="border p-2">Giới Tính</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Khoá Học</th>
            <th className="border p-2">Chuyên Ngành</th>
            <th className="border p-2">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {danhSach.map((sv, index) => (
            <tr key={index} className="hover:bg-gray-100 text-center">
              <td className="border p-2">{sv.MASV}</td>
              <td className="border p-2">{sv.HOTEN}</td>
              <td className="border p-2">{sv.GIOITINH}</td>
              <td className="border p-2">{sv.EMAIL}</td>
              <td className="border p-2">{sv.KHOAHOC}</td>
              <td className="border p-2">{sv.ChuyenNganh?.TENCHUYENNGANH}</td>
              <td className="border p-2">{sv.TRANGTHAI}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SinhVien