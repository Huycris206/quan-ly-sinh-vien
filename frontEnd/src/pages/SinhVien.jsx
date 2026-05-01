import { useEffect, useState } from 'react'
import { getAllSinhVien, createSinhVien, updateSinhVien, deleteSinhVien } from '../services/sinhVienService'

const TRANG_THAI_OPTIONS = ['DangHoc', 'TotNghiep', 'BaoLuu']

const formRong = {
  HOTEN: '', GIOITINH: 'Nam', NGAYSINH: '', SDT: '',
  EMAIL: '', CCCD: '', QUEQUAN: '', DIACHI: '',
  KHOAHOC: '', TRANGTHAI: 'DangHoc', MATKHAU: '', CHUYENNGANH_ID: ''
}

const trangThaiColor = (tt) => {
  if (tt === 'DangHoc') return 'bg-green-100 text-green-700'
  if (tt === 'TotNghiep') return 'bg-blue-100 text-blue-700'
  if (tt === 'BaoLuu') return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-600'
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function FormSinhVien({ form, setForm, onSubmit, loading, isEdit }) {
  return (
    <div className="space-y-3">
      {!isEdit && (
        <div>
          <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
          <input type="password" className="input" value={form.MATKHAU}
            onChange={e => setForm({ ...form, MATKHAU: e.target.value })} />
        </div>
      )}
      <div>
        <label className="text-sm font-medium text-gray-700">Họ tên</label>
        <input className="input" value={form.HOTEN}
          onChange={e => setForm({ ...form, HOTEN: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Giới tính</label>
          <select className="input" value={form.GIOITINH}
            onChange={e => setForm({ ...form, GIOITINH: e.target.value })}>
            <option>Nam</option>
            <option>Nữ</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
          <input type="date" className="input" value={form.NGAYSINH}
            onChange={e => setForm({ ...form, NGAYSINH: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input className="input" value={form.EMAIL}
          onChange={e => setForm({ ...form, EMAIL: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">SĐT</label>
          <input className="input" value={form.SDT}
            onChange={e => setForm({ ...form, SDT: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">CCCD</label>
          <input className="input" value={form.CCCD}
            onChange={e => setForm({ ...form, CCCD: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Quê quán</label>
        <input className="input" value={form.QUEQUAN}
          onChange={e => setForm({ ...form, QUEQUAN: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
        <input className="input" value={form.DIACHI}
          onChange={e => setForm({ ...form, DIACHI: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Khoá học</label>
          <input className="input" value={form.KHOAHOC}
            onChange={e => setForm({ ...form, KHOAHOC: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Trạng thái</label>
          <select className="input" value={form.TRANGTHAI}
            onChange={e => setForm({ ...form, TRANGTHAI: e.target.value })}>
            {TRANG_THAI_OPTIONS.map(tt => <option key={tt}>{tt}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">ID Chuyên ngành</label>
        <input className="input" value={form.CHUYENNGANH_ID}
          onChange={e => setForm({ ...form, CHUYENNGANH_ID: e.target.value })} />
      </div>
      <button onClick={onSubmit} disabled={loading}
        className="w-full bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50">
        {loading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Thêm sinh viên'}
      </button>
    </div>
  )
}

function SinhVien() {
  const [danhSach, setDanhSach] = useState([])
  const [tuKhoa, setTuKhoa] = useState('')
  const [locTrangThai, setLocTrangThai] = useState('')
  const [loading, setLoading] = useState(false)

  const [showThem, setShowThem] = useState(false)
  const [showSua, setShowSua] = useState(false)
  const [showXoa, setShowXoa] = useState(false)
  const [svChon, setSvChon] = useState(null)
  const [form, setForm] = useState(formRong)

  const taiDanhSach = () => {
    getAllSinhVien().then(setDanhSach).catch(console.log)
  }

  useEffect(() => { taiDanhSach() }, [])

  const danhSachLoc = danhSach.filter(sv => {
    const khopTuKhoa =
      sv.HOTEN?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      sv.MASV?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      sv.EMAIL?.toLowerCase().includes(tuKhoa.toLowerCase())
    const khopTrangThai = locTrangThai === '' || sv.TRANGTHAI === locTrangThai
    return khopTuKhoa && khopTrangThai
  })

  const handleThem = () => { setForm(formRong); setShowThem(true) }
  const submitThem = () => {
    setLoading(true)
    createSinhVien(form)
      .then(() => { taiDanhSach(); setShowThem(false) })
      .catch(console.log)
      .finally(() => setLoading(false))
  }

  const handleSua = (sv) => {
    setSvChon(sv)
    setForm({
      HOTEN: sv.HOTEN || '',
      GIOITINH: sv.GIOITINH || 'Nam',
      NGAYSINH: sv.NGAYSINH?.split('T')[0] || '',
      SDT: sv.SDT || '',
      EMAIL: sv.EMAIL || '',
      CCCD: sv.CCCD || '',
      QUEQUAN: sv.QUEQUAN || '',
      DIACHI: sv.DIACHI || '',
      KHOAHOC: sv.KHOAHOC || '',
      TRANGTHAI: sv.TRANGTHAI || 'DangHoc',
      CHUYENNGANH_ID: sv.CHUYENNGANH_ID || ''
    })
    setShowSua(true)
  }
  const submitSua = () => {
    setLoading(true)
    updateSinhVien(svChon.ID, form)
      .then(() => { taiDanhSach(); setShowSua(false) })
      .catch(console.log)
      .finally(() => setLoading(false))
  }

  const handleXoa = (sv) => { setSvChon(sv); setShowXoa(true) }
  const submitXoa = () => {
    setLoading(true)
    deleteSinhVien(svChon.ID)
      .then(() => { taiDanhSach(); setShowXoa(false) })
      .catch(console.log)
      .finally(() => setLoading(false))
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh Sách Sinh Viên</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý thông tin sinh viên</p>
        </div>
        <button onClick={handleThem}
          className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition">
          + Thêm sinh viên
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex gap-3">
          <input type="text" placeholder="Tìm theo tên, mã SV, email..."
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            value={tuKhoa} onChange={e => setTuKhoa(e.target.value)} />
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            value={locTrangThai} onChange={e => setLocTrangThai(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {TRANG_THAI_OPTIONS.map(tt => <option key={tt} value={tt}>{tt}</option>)}
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
              <th className="px-5 py-3 text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {danhSachLoc.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-12 text-gray-400 text-sm">Không tìm thấy sinh viên nào</td></tr>
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
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleSua(sv)}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
                        Sửa
                      </button>
                      <button onClick={() => handleXoa(sv)}
                        className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition">
                        Xóa
                      </button>
                    </div>
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

      {showThem && (
        <Modal title="Thêm Sinh Viên" onClose={() => setShowThem(false)}>
          <FormSinhVien form={form} setForm={setForm} onSubmit={submitThem} loading={loading} isEdit={false} />
        </Modal>
      )}

      {showSua && (
        <Modal title="Sửa Thông Tin Sinh Viên" onClose={() => setShowSua(false)}>
          <FormSinhVien form={form} setForm={setForm} onSubmit={submitSua} loading={loading} isEdit={true} />
        </Modal>
      )}

      {showXoa && (
        <Modal title="Xác nhận xóa" onClose={() => setShowXoa(false)}>
          <p className="text-gray-600 mb-5">Bạn có chắc muốn xóa sinh viên <strong>{svChon?.HOTEN}</strong>?</p>
          <div className="flex gap-3">
            <button onClick={() => setShowXoa(false)}
              className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
              Hủy
            </button>
            <button onClick={submitXoa} disabled={loading}
              className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition disabled:opacity-50">
              {loading ? 'Đang xóa...' : 'Xóa'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SinhVien