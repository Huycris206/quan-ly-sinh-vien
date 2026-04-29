import { useEffect, useState } from 'react'
import { getAllMonHoc } from '../services/monHocService'

function MonHoc() {
  const [danhSach, setDanhSach] = useState([])
  const [tuKhoa, setTuKhoa] = useState('')

  useEffect(() => {
    getAllMonHoc()
      .then(data => setDanhSach(data))
      .catch(err => console.log(err))
  }, [])

  const danhSachLoc = danhSach.filter(mh =>
    mh.TENMH?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
    mh.MAMH?.toLowerCase().includes(tuKhoa.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Danh Sách Môn Học</h1>
        <p className="text-gray-500 text-sm mt-1">Quản lý thông tin môn học</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <input
            type="text"
            placeholder="Tìm theo tên, mã môn học..."
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            value={tuKhoa}
            onChange={e => setTuKhoa(e.target.value)}
          />
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3 text-left">Mã MH</th>
              <th className="px-5 py-3 text-left">Tên Môn Học</th>
              <th className="px-5 py-3 text-left">Số Tín Chỉ</th>
              <th className="px-5 py-3 text-left">Loại</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {danhSachLoc.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-gray-400 text-sm">
                  Không tìm thấy môn học nào
                </td>
              </tr>
            ) : (
              danhSachLoc.map((mh, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-green-600">{mh.MAMH}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-800">{mh.TENMH}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{mh.SOTINCHI}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{mh.LOAIMH}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Hiển thị {danhSachLoc.length} / {danhSach.length} môn học
        </div>
      </div>
    </div>
  )
}

export default MonHoc