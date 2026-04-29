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

  const trangThaiColor = (tt) => {
    if (tt === 'DangHoc') return 'bg-green-100 text-green-700'
    if (tt === 'TotNghiep') return 'bg-blue-100 text-blue-700'
    if (tt === 'BaoLuu') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Danh Sách Sinh Viên</h1>
        <p className="text-gray-500 text-sm mt-1">Quản lý thông tin sinh viên</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex gap-3">
          <input
            type="text"
            placeholder="Tìm theo tên, mã SV, email..."
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            value={tuKhoa}
            onChange={e => setTuKhoa(e.target.value)}
          />
          <select
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            value={locTrangThai}
            onChange={e => setLocTrangThai(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="DangHoc">Đang Học</option>
            <option value="TotNghiep">Tốt Nghiệp</option>
            <option value="BaoLuu">Bảo Lưu</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3 text-left">Mã SV</th>
              <th className="px-5 py-3 text-left">Họ Tên</th>
              <th className="px-5 py-3 text-left">Giới Tính</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Khoá Học</th>
              <th className="px-5 py-3 text-left">Chuyên Ngành</th>
              <th className="px-5 py-3 text-left">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {danhSachLoc.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-400 text-sm">
                  Không tìm thấy sinh viên nào
                </td>
              </tr>
            ) : (
              danhSachLoc.map((sv, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-green-600">{sv.MASV}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-800">{sv.HOTEN}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{sv.GIOITINH}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{sv.EMAIL}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{sv.KHOAHOC}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{sv.ChuyenNganh?.TENCHUYENNGANH}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${trangThaiColor(sv.TRANGTHAI)}`}>
                      {sv.TRANGTHAI}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Hiển thị {danhSachLoc.length} / {danhSach.length} sinh viên
        </div>
      </div>
    </div>
  )
}

export default SinhVien