import { useEffect, useState } from 'react'
import { getAllSinhVien } from '../services/sinhVienService'

function SinhVien() {
  const [danhSach, setDanhSach] = useState([])
  const [tuKhoa, setTuKhoa] = useState('')
  const [locTrangThai, setLocTrangThai] = useState('')

  useEffect(() => {
    getAllSinhVien()
      .then(data => setDanhSach(data))
      .catch(err => console.log(err))
  }, [])

  const danhSachLoc = danhSach.filter(sv => {
    const khopTuKhoa = 
      sv.HOTEN?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      sv.MASV?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      sv.EMAIL?.toLowerCase().includes(tuKhoa.toLowerCase())
    
    const khopTrangThai = locTrangThai === '' || sv.TRANGTHAI === locTrangThai
    
    return khopTuKhoa && khopTrangThai
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh Sách Sinh Viên</h1>

      {/* Thanh tìm kiếm và lọc */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên, mã SV, email..."
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={tuKhoa}
          onChange={e => setTuKhoa(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={locTrangThai}
          onChange={e => setLocTrangThai(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="DangHoc">Đang Học</option>
          <option value="TotNghiep">Tốt Nghiệp</option>
          <option value="BaoLuu">Bảo Lưu</option>
          <option value="DiHoc">Đình Chỉ</option>
        </select>
      </div>

      {/* Bảng sinh viên */}
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
          {danhSachLoc.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                Không tìm thấy sinh viên nào
              </td>
            </tr>
          ) : (
            danhSachLoc.map((sv, index) => (
              <tr key={index} className="hover:bg-gray-100 text-center">
                <td className="border p-2">{sv.MASV}</td>
                <td className="border p-2">{sv.HOTEN}</td>
                <td className="border p-2">{sv.GIOITINH}</td>
                <td className="border p-2">{sv.EMAIL}</td>
                <td className="border p-2">{sv.KHOAHOC}</td>
                <td className="border p-2">{sv.ChuyenNganh?.TENCHUYENNGANH}</td>
                <td className="border p-2">{sv.TRANGTHAI}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Tổng số */}
      <p className="mt-3 text-gray-500 text-sm">
        Hiển thị {danhSachLoc.length} / {danhSach.length} sinh viên
      </p>
    </div>
  )
}

export default SinhVien