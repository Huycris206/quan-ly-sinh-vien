import React from "react";
import { Link } from "react-router-dom";

const SinhVienTable = ({ sinhViens, onEdit, onDelete }) => {
  return (
    <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground text-sm">
              <th className="py-4 px-6">Mã SV</th>
              <th className="py-4 px-6">Họ và Tên</th>
              <th className="py-4 px-6">Chuyên Ngành</th>
              <th className="py-4 px-6">SĐT</th>
              <th className="py-4 px-6 text-center">Trạng Thái</th>
              <th className="py-4 px-6 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-border">
            {sinhViens.map((sv) => (
              <tr key={sv.ID} className="hover:bg-muted/30">
                <td className="py-3 px-6 font-medium">{sv.MASV}</td>
                <td className="py-3 px-6">{sv.HOTEN}</td>

                <td className="py-3 px-6">
                  {sv.ChuyenNganh?.TENCHUYENNGANH || "Chưa xếp"}
                </td>

                <td className="py-3 px-6">{sv.SDT || "---"}</td>

                <td className="py-3 px-6 text-center"> 
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm 
                      ${
                        sv.TRANGTHAI === 'DangHoc'
                          ? 'bg-green-100/90 text-green-700 border-green-200'
                          : sv.TRANGTHAI === 'BaoLuu'
                          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          : 'bg-destructive/10 text-destructive border-destructive/20'
                      }`}
                  >
                    {sv.TRANGTHAI === 'DangHoc'
                      ? 'Đang học'
                      : sv.TRANGTHAI === 'BaoLuu'
                      ? 'Bảo lưu'
                      : 'Tốt nghiệp'}
                  </span> 
                </td>

                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center gap-2">
                    
                    <Link
                      to={`/sinhviens/${sv.MASV}`}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                    >
                      Xem
                    </Link>

                    <button
                      onClick={() => onEdit(sv)}
                      className="px-3 py-1 text-xs border rounded"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => onDelete(sv.ID)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                    >
                      Xóa
                    </button>

                  </div>
                </td>
              </tr>
            ))}

            {sinhViens.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-muted-foreground">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SinhVienTable;
//

//