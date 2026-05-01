import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import { useGiangViens } from "../../hooks/useGiangViens";
import Loadingcomp from "@/components/ui/Loading.jsx"; 
import { Search } from "lucide-react"; 

const ManageGiangVien = () => {
  const { giangViens, loading, error, refetch, deleteGiangVien, updateGiangVien, createGiangVien } = useGiangViens();
  
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 

  // =================== XỬ LÝ LỌC TÌM KIẾM ===================
  const filteredGiangViens = giangViens.filter((gv) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      gv.HOTEN?.toLowerCase().includes(searchLower) ||
      gv.MAGV?.toLowerCase().includes(searchLower) ||
      gv.SDT?.includes(searchLower)
    );
  });

  // =================== XỬ LÝ SUBMIT FORM ===================
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTeacherData = Object.fromEntries(formData.entries());
    const isSuccess = await createGiangVien(newTeacherData);
    if (isSuccess) setIsAddingMode(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());
    const isSuccess = await updateGiangVien(editingTeacher.ID, updatedData);
    if (isSuccess) setEditingTeacher(null);
  };

  // =================== RENDER TRẠNG THÁI ===================
  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><Loadingcomp caigi="dữ liệu giảng viên" /></div>;
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
          <h2 className="text-2xl font-bold text-foreground">Quản Lý Giảng Viên</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Hệ thống đang quản lý tổng cộng {giangViens.length} giảng viên
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo Mã GV, Tên, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <button 
            onClick={() => setIsAddingMode(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
          >
            + Thêm giảng viên
          </button>
        </div>
      </div>

      {/* 2. TABLE DANH SÁCH */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground text-sm tracking-wide">
                <th className="py-4 px-6 font-semibold whitespace-nowrap">Mã GV</th>
                <th className="py-4 px-6 font-semibold whitespace-nowrap">Họ và Tên</th>
                <th className="py-4 px-6 font-semibold whitespace-nowrap">Giới tính</th>
                <th className="py-4 px-6 font-semibold whitespace-nowrap">SĐT</th>
                <th className="py-4 px-6 font-semibold whitespace-nowrap">Tài Khoản</th>
                <th className="py-4 px-6 font-semibold text-center whitespace-nowrap">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-foreground text-sm divide-y divide-border">
              {filteredGiangViens.map((gv) => (
                <tr key={gv.ID} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-6 font-medium uppercase tracking-wider">{gv.MAGV}</td>
                  <td className="py-3 px-6 font-medium">{gv.HOTEN}</td>
                  <td className="py-3 px-6 text-muted-foreground">{gv.GIOITINH || "---"}</td>
                  <td className="py-3 px-6 text-muted-foreground">{gv.SDT || "---"}</td>
                  <td className="py-3 px-6">
                    {gv.TaiKhoan?.TENDANGNHAP ? (
                      <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {gv.TaiKhoan.TENDANGNHAP}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">Chưa cấp</span>
                    )}
                  </td>
                  
                  {/* CỘT HÀNH ĐỘNG */}
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/giangviens/${gv.MAGV}`} 
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-transparent bg-blue-50 text-blue-600 hover:bg-blue-100 h-8 px-3 shadow-sm"
                      >
                        Xem
                      </Link>
                      <button
                        onClick={() => setEditingTeacher(gv)}
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 shadow-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => deleteGiangVien(gv.ID)}
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3 shadow-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredGiangViens.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-muted-foreground bg-background">
                    {giangViens.length === 0 ? "Hệ thống chưa có dữ liệu giảng viên nào." : `Không tìm thấy kết quả nào cho "${searchTerm}"`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MODAL FORM THÊM / SỬA */}
      {(isAddingMode || editingTeacher) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-background p-6 rounded-xl w-full max-w-2xl shadow-xl border border-border max-h-[90vh] overflow-y-auto slide-in-from-bottom-4 animate-in duration-300">
            
            <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-3">
              {isAddingMode ? "Thêm Giảng Viên Mới" : `Cập nhật mã GV: ${editingTeacher.MAGV}`}
            </h3>
            
            <form onSubmit={isAddingMode ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Họ và Tên <span className="text-destructive">*</span></label>
                  <input required name="HOTEN" defaultValue={editingTeacher?.HOTEN || ""} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Nguyễn Văn A" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">CCCD <span className="text-destructive">*</span></label>
                  <input required name="CCCD" defaultValue={editingTeacher?.CCCD || ""} type="text" readOnly={!!editingTeacher} className={`flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${editingTeacher ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background'}`} placeholder="079123456789" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Giới tính</label>
                  <select name="GIOITINH" defaultValue={editingTeacher?.GIOITINH || "Nam"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Ngày sinh</label>
                  <input name="NGAYSINH" defaultValue={editingTeacher?.NGAYSINH?.split('T')[0] || ""} type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Số điện thoại</label>
                  <input name="SDT" defaultValue={editingTeacher?.SDT || ""} type="tel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="090..." />
                </div>

              </div>

              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-border">
                <button type="button" onClick={() => { setIsAddingMode(false); setEditingTeacher(null); }} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4">
                  Hủy bỏ
                </button>
                <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 shadow-sm">
                  {isAddingMode ? "Lưu giảng viên" : "Cập nhật thay đổi"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGiangVien;