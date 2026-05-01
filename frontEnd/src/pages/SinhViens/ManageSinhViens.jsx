import React, { useState } from "react";
import { Link } from "react-router-dom"; // <-- QUAN TRỌNG: Import Link để chuyển trang
import { useSinhViens } from "@/hooks/useSinhViens";
import Loadingcomp from "@/components/ui/Loading.jsx"; 
import { Search } from "lucide-react"; 
import SinhVienTable from "./SinhVienTable";

const ManageSinhVien = () => {
  const { sinhViens, loading, error, refetch, deleteSinhVien, updateSinhVien, createSinhVien } = useSinhViens();
  
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 

  // =================== XỬ LÝ LỌC TÌM KIẾM ===================
  const filteredSinhViens = sinhViens.filter((sv) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sv.HOTEN?.toLowerCase().includes(searchLower) ||
      sv.MASV?.toLowerCase().includes(searchLower) ||
      sv.SDT?.includes(searchLower)
    );
  });

  // =================== XỬ LÝ SUBMIT FORM ===================
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStudentData = Object.fromEntries(formData.entries());
    const isSuccess = await createSinhVien(newStudentData);
    if (isSuccess) setIsAddingMode(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());
    const isSuccess = await updateSinhVien(editingStudent.ID, updatedData);
    if (isSuccess) setEditingStudent(null);
  };

  // =================== RENDER TRẠNG THÁI ===================
  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><Loadingcomp caigi="dữ liệu sinh viên" /></div>;
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
          <h2 className="text-2xl font-bold text-foreground">Quản Lý Sinh Viên</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Hệ thống đang quản lý tổng cộng {sinhViens.length} sinh viên
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo Mã SV, Tên, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* NÚT THÊM SINH VIÊN (Nằm ngay cạnh thanh tìm kiếm) */}
          <button 
            onClick={() => setIsAddingMode(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
          >
            + Thêm sinh viên
          </button>
        </div>
      </div>

      {/* 2. TABLE DANH SÁCH */}
      <SinhVienTable
        sinhViens={filteredSinhViens}
        onEdit={setEditingStudent}
        onDelete={deleteSinhVien}
      />

      {/* 3. MODAL FORM THÊM / SỬA */}
      {(isAddingMode || editingStudent) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-background p-6 rounded-xl w-full max-w-2xl shadow-xl border border-border max-h-[90vh] overflow-y-auto slide-in-from-bottom-4 animate-in duration-300">
            
            <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-3">
              {isAddingMode ? "Thêm Sinh Viên Mới" : `Cập nhật mã SV: ${editingStudent.MASV}`}
            </h3>
            
            <form onSubmit={isAddingMode ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Họ và Tên <span className="text-destructive">*</span></label>
                  <input required name="HOTEN" defaultValue={editingStudent?.HOTEN || ""} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Nguyễn Văn A" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">CCCD <span className="text-destructive">*</span></label>
                  <input required name="CCCD" defaultValue={editingStudent?.CCCD || ""} type="text" readOnly={!!editingStudent} className={`flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${editingStudent ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background'}`} placeholder="079123456789" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Giới tính</label>
                  <select name="GIOITINH" defaultValue={editingStudent?.GIOITINH || "Nam"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Ngày sinh</label>
                  <input name="NGAYSINH" defaultValue={editingStudent?.NGAYSINH?.split('T')[0] || ""} type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">ID Chuyên ngành <span className="text-destructive">*</span></label>
                  <input required name="CHUYENNGANH_ID" defaultValue={editingStudent?.CHUYENNGANH_ID || ""} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Nhập ID chuyên ngành" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Số điện thoại</label>
                  <input name="SDT" defaultValue={editingStudent?.SDT || ""} type="tel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="090..." />
                </div>

                {editingStudent && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Trạng thái học tập</label>
                    <select name="TRANGTHAI" defaultValue={editingStudent.TRANGTHAI} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="DangHoc">Đang học</option>
                      <option value="BaoLuu">Bảo lưu</option>
                      <option value="TotNghiep">Tốt nghiệp</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-border">
                <button type="button" onClick={() => { setIsAddingMode(false); setEditingStudent(null); }} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4">
                  Hủy bỏ
                </button>
                <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 shadow-sm">
                  {isAddingMode ? "Lưu sinh viên" : "Cập nhật thay đổi"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSinhVien;