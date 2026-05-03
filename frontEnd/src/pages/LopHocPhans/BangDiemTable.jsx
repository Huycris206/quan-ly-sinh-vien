import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";

// Component con: Quản lý trạng thái nhập liệu cho từng dòng (từng sinh viên)
const GradeRow = ({ sv, onSaveDiem, isSaving }) => {
  // Khởi tạo state từ dữ liệu mặc định, nếu null thì để chuỗi rỗng
  const [diemCC, setDiemCC] = useState(sv.DIEMCHUYENCAN ?? "");
  const [diemGK, setDiemGK] = useState(sv.DIEMGIUAKY ?? "");
  const [diemCK, setDiemCK] = useState(sv.DIEMCUOIKY ?? "");

  // Đồng bộ lại state nếu dữ liệu từ DB truyền xuống thay đổi
  useEffect(() => {
    setDiemCC(sv.DIEMCHUYENCAN ?? "");
    setDiemGK(sv.DIEMGIUAKY ?? "");
    setDiemCK(sv.DIEMCUOIKY ?? "");
  }, [sv]);

  const handleSave = () => {
    onSaveDiem({
      SINHVIEN_ID: sv.SINHVIEN_ID,
      LOPHOCPHAN_ID: sv.LOPHOCPHAN_ID,
      DIEMCHUYENCAN: diemCC !== "" ? parseFloat(diemCC) : null,
      DIEMGIUAKY: diemGK !== "" ? parseFloat(diemGK) : null,
      DIEMCUOIKY: diemCK !== "" ? parseFloat(diemCK) : null,
    });
  };

  return (
    <tr className="hover:bg-muted/30">
      <td className="py-3 px-6 font-medium text-center">{sv.MASV}</td>
      <td className="py-3 px-6 font-medium">{sv.HOTEN}</td>
      
      {/* Cột Điểm Chuyên Cần */}
      <td className="py-3 px-6 text-center">
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={diemCC}
          onChange={(e) => setDiemCC(e.target.value)}
          className="w-16 px-2 py-1 text-sm text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="--"
        />
      </td>

      {/* Cột Điểm Giữa Kỳ */}
      <td className="py-3 px-6 text-center">
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={diemGK}
          onChange={(e) => setDiemGK(e.target.value)}
          className="w-16 px-2 py-1 text-sm text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="--"
        />
      </td>

      {/* Cột Điểm Cuối Kỳ */}
      <td className="py-3 px-6 text-center">
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={diemCK}
          onChange={(e) => setDiemCK(e.target.value)}
          className="w-16 px-2 py-1 text-sm text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="--"
        />
      </td>

      {/* Cột Tổng Kết (Chỉ xem, lấy từ DB tính toán sẵn) */}
      <td className="py-3 px-6 text-center font-bold text-primary">
        {sv.DIEMTONGKET ?? "---"} ({sv.DIEMHECHU ?? "-"})
      </td>

      {/* Cột Hành Động */}
      <td className="py-3 px-6 text-center">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save size={14} />
          Lưu
        </button>
      </td>
    </tr>
  );
};

// Component Cha: Bảng chứa danh sách
const BangDiemTable = ({ danhSachDiem, onSaveDiem, isSaving }) => {
  return (
    <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground text-sm">
              <th className="py-4 px-6 text-center">Mã SV</th>
              <th className="py-4 px-6">Họ và Tên</th>
              <th className="py-4 px-6 text-center">Điểm CC (10%)</th>
              <th className="py-4 px-6 text-center">Điểm GK (30%)</th>
              <th className="py-4 px-6 text-center">Điểm CK (60%)</th>
              <th className="py-4 px-6 text-center">Tổng Kết</th>
              <th className="py-4 px-6 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-border">
            {danhSachDiem.map((sv) => (
              <GradeRow 
                key={sv.SINHVIEN_ID} 
                sv={sv} 
                onSaveDiem={onSaveDiem} 
                isSaving={isSaving} 
              />
            ))}

            {danhSachDiem.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-muted-foreground">
                  Lớp học phần này chưa có sinh viên đăng ký.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BangDiemTable;