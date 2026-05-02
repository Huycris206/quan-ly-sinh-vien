import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSinhViens } from "../../hooks/sinhVienHooks/useSinhViens";
import Loadingcomp from "@/components/ui/loading.jsx"; // Check lại đường dẫn
import { 
  ArrowLeft, Mail, Phone, Calendar, 
  CreditCard, User, GraduationCap, MapPin, Briefcase 
} from "lucide-react";

import { useSinhVienLogic } from "@/hooks/sinhVienHooks/useSinhVienLogics";
import SinhVienModal from "./component/SinhVienModal.jsx";

export default function SinhVienDetail() {
  // 1. Lấy mã sinh viên từ URL (ví dụ: /students/SV001 -> id = SV001)
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const { 
    isAddingMode, // Bắt buộc lấy ra để Modal biết là đang Thêm hay Sửa
    editingStudent,
    setEditingStudent, 
    handleCloseModal,
    handleEditSubmit
  } = useSinhVienLogic();
  // 2. Lấy dữ liệu từ Hook
  const { sinhViens, loading, error } = useSinhViens();

  // 3. Tìm sinh viên khớp với MASV trên URL
  // Lưu ý: So sánh không phân biệt hoa thường để tránh lỗi gõ URL
  const student = sinhViens.find((sv) => sv.MASV?.toLowerCase() === id?.toLowerCase());

  // =================== RENDER TRẠNG THÁI ===================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loadingcomp caigi="hồ sơ sinh viên" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-8 text-center bg-destructive/10 rounded-xl border border-destructive/20">
        <p className="text-destructive font-medium mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-background border border-border rounded-md text-sm hover:bg-muted">
          Quay lại
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-8 text-center bg-background rounded-xl border border-border shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-2">Không tìm thấy sinh viên</h2>
        <p className="text-muted-foreground mb-6">Mã sinh viên <strong className="text-primary">{id}</strong> không tồn tại trong hệ thống.</p>
        <button onClick={() => navigate('/students')} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
          <ArrowLeft size={16} /> Về danh sách
        </button>
      </div>
    );
  }

  // =================== RENDER GIAO DIỆN CHÍNH ===================
  return (
    <div className="py-6 px-4 md:px-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>
        <button
          onClick={() => setEditingStudent(student)}
          className="px-3 py-1 text-xl border rounded text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          Sửa
        </button>

      </div>
      {/* Nút Quay Lại */}
      

      {/* THẺ HỒ SƠ TỔNG QUAN (Header Profile) */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden mb-6">
        {/* Ảnh bìa (Cover) */}
        <div className="h-32 bg-muted w-full relative border-b border-border">
          {/* Avatar đè lên ảnh bìa */}
          <div className="absolute -bottom-12 left-6 h-24 w-24 rounded-full border-4 border-background bg-muted overflow-hidden shadow-md flex items-center justify-center">
            {student.TaiKhoan?.ANHDAIDIEN ? (
              <img src={student.TaiKhoan.ANHDAIDIEN} alt={student.HOTEN} className="h-full w-full object-cover" />
            ) : (
              <User size={40} className="text-muted-foreground/50" />
            )}
          </div>
        </div>

        {/* Thông tin chính */}
        <div className="pt-14 pb-6 px-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{student.HOTEN}</h1>
            <p className="text-muted-foreground font-medium mt-1 uppercase tracking-wider">{student.MASV}</p>
          </div>
          
          {/* Badge Trạng thái */}
          <div>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold shadow-sm ${
              student.TRANGTHAI === 'DangHoc' 
                ? 'bg-green-100/90 text-green-700 border-green-200' 
                : student.TRANGTHAI === 'BaoLuu' 
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}>
              {student.TRANGTHAI === 'DangHoc' ? 'Đang học' : student.TRANGTHAI === 'BaoLuu' ? 'Bảo lưu' : 'Tốt nghiệp'}
            </span>
          </div>
        </div>
      </div>

      {/* LƯỚI THÔNG TIN CHI TIẾT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cột 1: Thông tin học tập */}
        <div className="bg-background rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">Thông tin học tập</h3>
          
          <div className="flex items-center gap-3 text-muted-foreground">
            <GraduationCap className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Chuyên ngành</p>
              <p className="text-sm font-medium text-foreground">{student.ChuyenNganh?.TENCHUYENNGANH || "Chưa xếp chuyên ngành"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Briefcase className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Khoá học</p>
              <p className="text-sm font-medium text-foreground">{student.KHOAHOC || "---"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <User className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Tài khoản đăng nhập</p>
              <p className="text-sm font-medium text-foreground">{student.TaiKhoan?.TENDANGNHAP || "Chưa cấp"}</p>
            </div>
          </div>
        </div>

        {/* Cột 2: Thông tin cá nhân */}
        <div className="bg-background rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">Thông tin cá nhân</h3>
          
          <div className="flex items-center gap-3 text-muted-foreground">
            <CreditCard className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">CCCD</p>
              <p className="text-sm font-medium text-foreground">{student.CCCD}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Ngày sinh</p>
              <p className="text-sm font-medium text-foreground">
                {student.NGAYSINH ? new Date(student.NGAYSINH).toLocaleDateString('vi-VN') : "---"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Số điện thoại</p>
              <p className="text-sm font-medium text-foreground">{student.SDT || "---"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Email</p>
              <p className="text-sm font-medium text-foreground">{student.EMAIL || "---"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Địa chỉ / Quê quán</p>
              <p className="text-sm font-medium text-foreground">{student.DIACHI || student.QUEQUAN || "---"}</p>
            </div>
          </div>
        </div>

      </div>

      <SinhVienModal 
        isAddingMode={isAddingMode}
        editingStudent={editingStudent}
        onClose={handleCloseModal}
        onEditSubmit={handleEditSubmit}
      />

    </div>
  );
}