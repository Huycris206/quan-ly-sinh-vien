import React from "react";
import { Link } from "react-router-dom";

const LopHocPhanTable = ({ classes, searchTerm, onEdit, onDelete }) => {
  return (
    <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground text-sm tracking-wide">
              <th className="py-4 px-6 font-semibold whitespace-nowrap">Mã Lớp</th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap">Môn Học</th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap">Giảng Viên</th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap text-center">Học Kỳ</th>
              <th className="py-4 px-6 font-semibold whitespace-nowrap text-center">Sĩ số (Max)</th>
              <th className="py-4 px-6 font-semibold text-center whitespace-nowrap">Trạng Thái</th>
              <th className="py-4 px-6 font-semibold text-center whitespace-nowrap">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-foreground text-sm divide-y divide-border">
            {classes.map((lop) => {
              const idLop = lop.ID || lop.Id;
              return (
                <tr key={idLop} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-6 font-medium uppercase tracking-wider text-primary">{lop.MALOP}</td>
                  <td className="py-3 px-6">
                    <div className="font-medium">{lop.MonHoc?.TENMONHOC || "---"}</div>
                    <div className="text-xs text-muted-foreground">{lop.MonHoc?.SOTINCHI ? `${lop.MonHoc.SOTINCHI} tín chỉ` : ''}</div>
                  </td>
                  <td className="py-3 px-6 font-medium text-muted-foreground">
                    {lop.GiangVien?.HOTEN || <span className="italic">Chưa phân công</span>}
                  </td>
                  <td className="py-3 px-6 text-center">{lop.HOCKY || "---"}</td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-muted px-2 py-1 rounded text-xs font-semibold">{lop.SISO || 0} / { lop.SISO_TOIDA || 70}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
                      lop.TRANGTHAI === 'Mo' ? 'bg-blue-100/90 text-blue-700 border-blue-200' : 
                      lop.TRANGTHAI === 'DangHoc' ? 'bg-green-100/90 text-green-700 border-green-200' : 
                      lop.TRANGTHAI === 'KetThuc' ? 'bg-gray-100/90 text-gray-700 border-gray-200' : 
                      lop.TRANGTHAI === 'Dong' ? 'bg-orange-100/90 text-orange-700 border-orange-200' : 
                      'bg-destructive/10 text-destructive border-destructive/20'
                    }`}>
                      {
                        lop.TRANGTHAI === 'Mo' ? 'Đang mở (Đăng ký)' : 
                        lop.TRANGTHAI === 'DangHoc' ? 'Đang học' : 
                        lop.TRANGTHAI === 'KetThuc' ? 'Kết thúc' : 
                        lop.TRANGTHAI === 'Dong' ? 'Đã đóng' : 'Đã hủy'
                      }
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/lophocphans/${lop.MALOP}`} 
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-transparent bg-blue-50 text-blue-600 hover:bg-blue-100 h-8 px-3 shadow-sm"
                      >
                        Chi tiết
                      </Link>
                      <button
                        onClick={() => onEdit(lop)}
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 shadow-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => onDelete(idLop)}
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3 shadow-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {classes.length === 0 && (
              <tr>
                <td colSpan="7" className="py-10 text-center text-muted-foreground bg-background">
                  {searchTerm ? `Không tìm thấy lớp học phần nào cho "${searchTerm}"` : "Hệ thống chưa có lớp học phần nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LopHocPhanTable;