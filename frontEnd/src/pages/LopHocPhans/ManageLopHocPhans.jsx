import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLopHocPhans } from "../../hooks/useLopHocPhans";
import Loadingcomp from "@/components/ui/Loading.jsx"; 
import { Search } from "lucide-react"; 

const ManageLopHoc = () => {
  const { lopHocPhans, loading, error, refetch, deleteLopHocPhan, updateLopHocPhan, createLopHocPhan } = useLopHocPhans();
  
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [editingClass, setEditingClass] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 

  // =================== XỬ LÝ LỌC TÌM KIẾM ===================
  const filteredClasses = lopHocPhans.filter((lop) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lop.MALOP?.toLowerCase().includes(searchLower) || // Sửa thành MALOP
      lop.MonHoc?.TENMONHOC?.toLowerCase().includes(searchLower) ||
      lop.GiangVien?.HOTEN?.toLowerCase().includes(searchLower) ||
      lop.HOCKY?.toLowerCase().includes(searchLower) // Sửa thành HOCKY
    );
  });

  // =================== XỬ LÝ SUBMIT FORM ===================
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newClassData = Object.fromEntries(formData.entries());
    const isSuccess = await createLopHocPhan(newClassData);
    if (isSuccess) setIsAddingMode(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());
    
    const classId = editingClass.ID || editingClass.Id; 
    const isSuccess = await updateLopHocPhan(classId, updatedData);
    
    if (isSuccess) setEditingClass(null);
  };

  // =================== RENDER TRẠNG THÁI ===================
  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><Loadingcomp caigi="dữ liệu lớp học phần" /></div>;
  if (error) return (
      <div className="text-center p-10 bg-destructive/10 rounded-xl border border-destructive/20 mt-8">
        <p className="text-destructive font-medium">{error}</p>
        <button onClick={refetch} className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 text-sm font-medium">Tải lại</button>
      </div>
  );

  // =================== RENDER GIAO DIỆN CHÍNH ===================
  return (
    <div className="py-6 px-4 md:px-8">
      
      {/* 1. HEADER & THANH TÌM KIẾM */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Quản Lý Lớp Học Phần</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Hệ thống đang quản lý tổng cộng {lopHocPhans.length} lớp học phần
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo Mã lớp, Tên môn, GV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <button 
            onClick={() => setIsAddingMode(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
          >
            + Mở lớp mới
          </button>
        </div>
      </div>

      {/* 2. TABLE DANH SÁCH */}
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
              {filteredClasses.map((lop) => {
                const idLop = lop.ID || lop.Id;
                return (
                <tr key={idLop} className="hover:bg-muted/30 transition-colors">
                  
                  {/* Sử dụng MALOP */}
                  <td className="py-3 px-6 font-medium uppercase tracking-wider text-primary">{lop.MALOP}</td>
                  
                  <td className="py-3 px-6">
                    <div className="font-medium">{lop.MonHoc?.TENMONHOC || "---"}</div>
                    <div className="text-xs text-muted-foreground">{lop.MonHoc?.SOTINCHI ? `${lop.MonHoc.SOTINCHI} tín chỉ` : ''}</div>
                  </td>
                  
                  <td className="py-3 px-6 font-medium text-muted-foreground">
                    {lop.GiangVien?.HOTEN || <span className="italic">Chưa phân công</span>}
                  </td>
                  
                  {/* Sử dụng HOCKY */}
                  <td className="py-3 px-6 text-center">{lop.HOCKY || "---"}</td>
                  
                  {/* Sử dụng SISO_TOIDA */}
                  <td className="py-3 px-6 text-center">
                    <span className="bg-muted px-2 py-1 rounded text-xs font-semibold">{lop.SISO_TOIDA || 70}</span>
                  </td>
                  
                  {/* Sử dụng TRANGTHAI và map đúng 5 loại trạng thái */}
                  <td className="py-3 px-6 text-center">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
                      lop.TRANGTHAI === 'Mo' ? 'bg-blue-100/90 text-blue-700 border-blue-200' : 
                      lop.TRANGTHAI === 'DangHoc' ? 'bg-green-100/90 text-green-700 border-green-200' : 
                      lop.TRANGTHAI === 'KetThuc' ? 'bg-gray-100/90 text-gray-700 border-gray-200' : 
                      lop.TRANGTHAI === 'Dong' ? 'bg-orange-100/90 text-orange-700 border-orange-200' : 
                      'bg-destructive/10 text-destructive border-destructive/20' // Cho trạng thái Huy
                    }`}>
                      {
                        lop.TRANGTHAI === 'Mo' ? 'Đang mở (Đăng ký)' : 
                        lop.TRANGTHAI === 'DangHoc' ? 'Đang học' : 
                        lop.TRANGTHAI === 'KetThuc' ? 'Kết thúc' : 
                        lop.TRANGTHAI === 'Dong' ? 'Đã đóng' : 'Đã hủy'
                      }
                    </span>
                  </td>
                  
                  {/* CỘT HÀNH ĐỘNG */}
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/lophocphans/${lop.MALOP}`} 
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-transparent bg-blue-50 text-blue-600 hover:bg-blue-100 h-8 px-3 shadow-sm"
                      >
                        Chi tiết
                      </Link>
                      <button
                        onClick={() => setEditingClass(lop)}
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 shadow-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => deleteLopHocPhan(idLop)}
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3 shadow-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              )})}

              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-muted-foreground bg-background">
                    {lopHocPhans.length === 0 ? "Hệ thống chưa có lớp học phần nào." : `Không tìm thấy lớp học phần nào cho "${searchTerm}"`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MODAL FORM THÊM / SỬA */}
      {(isAddingMode || editingClass) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-background p-6 rounded-xl w-full max-w-2xl shadow-xl border border-border max-h-[90vh] overflow-y-auto slide-in-from-bottom-4 animate-in duration-300">
            
            <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-3">
              {isAddingMode ? "Mở Lớp Học Phần Mới" : `Cập nhật lớp: ${editingClass.MALOP}`}
            </h3>
            
            <form onSubmit={isAddingMode ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 
                  LƯU Ý: name của input VẪN GIỮ NGUYÊN (MaLop, HocKy, Sv_max, Status) 
                  bởi vì req.body bên Backend của bạn đang hứng các biến này.
                  Chỉ sửa defaultValue lấy từ editingClass.MALOP
                */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Mã Lớp <span className="text-destructive">*</span></label>
                  <input required name="MaLop" defaultValue={editingClass?.MALOP || ""} type="text" 
                    readOnly={!!editingClass}
                    className={`flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${editingClass ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background'}`} 
                    placeholder="VD: SE101.M11" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">ID Môn Học <span className="text-destructive">*</span></label>
                  <input required name="MonHocId" defaultValue={editingClass?.MonHocId || editingClass?.MONHOC_ID || ""} type="text" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                    placeholder="Nhập ID môn học..." 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">ID Giảng Viên</label>
                  <input name="Teacher_id" defaultValue={editingClass?.Teacher_id || editingClass?.GIANGVIEN_ID || ""} type="text" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                    placeholder="Nhập ID giảng viên..." 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Học Kỳ</label>
                  <input name="HocKy" defaultValue={editingClass?.HOCKY || ""} type="text" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                    placeholder="VD: HK1 2024-2025" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Sĩ số tối đa</label>
                  <input name="Sv_max" defaultValue={editingClass?.SISO_TOIDA || 70} type="number" min="1" max="200"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                  />
                </div>

                {editingClass && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Trạng thái</label>
                    <select name="Status" defaultValue={editingClass.TRANGTHAI || "Mo"} 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="Mo">Mở (Cho phép đăng ký)</option>
                      <option value="DangHoc">Đang học</option>
                      <option value="KetThuc">Kết thúc</option>
                      <option value="Dong">Đóng (Khóa)</option>
                      <option value="Huy">Hủy lớp</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-border">
                <button type="button" onClick={() => { setIsAddingMode(false); setEditingClass(null); }} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4">
                  Hủy bỏ
                </button>
                <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 shadow-sm">
                  {isAddingMode ? "Tạo lớp học phần" : "Cập nhật thay đổi"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLopHoc;