import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGiangViens } from "@/hooks/useGiangViens";
import Loadingcomp from "@/components/ui/Loading.jsx";
import { 
  ArrowLeft, Phone, Calendar, 
  CreditCard, User, Briefcase, KeyRound 
} from "lucide-react";

export default function GiangVienDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const { giangViens, loading, error } = useGiangViens();

  const teacher = giangViens.find((gv) => gv.MAGV?.toLowerCase() === id?.toLowerCase());

  // =================== RENDER TRẠNG THÁI ===================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loadingcomp caigi="hồ sơ giảng viên" />
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

  if (!teacher) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-8 text-center bg-background rounded-xl border border-border shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-2">Không tìm thấy giảng viên</h2>
        <p className="text-muted-foreground mb-6">Mã giảng viên <strong className="text-primary">{id}</strong> không tồn tại trong hệ thống.</p>
        <button onClick={() => navigate('/giangviens')} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
          <ArrowLeft size={16} /> Về danh sách
        </button>
      </div>
    );
  }

  // =================== RENDER GIAO DIỆN CHÍNH ===================
  return (
    <div className="py-6 px-4 md:px-8 max-w-5xl mx-auto w-full">
      
      {/* Nút Quay Lại */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      {/* THẺ HỒ SƠ TỔNG QUAN */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="h-32 bg-muted w-full relative border-b border-border">
          <div className="absolute -bottom-12 left-6 h-24 w-24 rounded-full border-4 border-background bg-muted overflow-hidden shadow-md flex items-center justify-center">
            {teacher.TaiKhoan?.ANHDAIDIEN ? (
              <img src={teacher.TaiKhoan.ANHDAIDIEN} alt={teacher.HOTEN} className="h-full w-full object-cover" />
            ) : (
              <User size={40} className="text-muted-foreground/50" />
            )}
          </div>
        </div>

        <div className="pt-14 pb-6 px-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{teacher.HOTEN}</h1>
            <p className="text-muted-foreground font-medium mt-1 uppercase tracking-wider">{teacher.MAGV}</p>
          </div>
          
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary shadow-sm">
              Giảng Viên
            </span>
          </div>
        </div>
      </div>

      {/* LƯỚI THÔNG TIN CHI TIẾT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cột 1: Thông tin cá nhân */}
        <div className="bg-background rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">Thông tin cá nhân</h3>
          
          <div className="flex items-center gap-3 text-muted-foreground">
            <CreditCard className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">CCCD</p>
              <p className="text-sm font-medium text-foreground">{teacher.CCCD}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <User className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Giới tính</p>
              <p className="text-sm font-medium text-foreground">{teacher.GIOITINH || "---"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Ngày sinh</p>
              <p className="text-sm font-medium text-foreground">
                {teacher.NGAYSINH ? new Date(teacher.NGAYSINH).toLocaleDateString('vi-VN') : "---"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Số điện thoại</p>
              <p className="text-sm font-medium text-foreground">{teacher.SDT || "---"}</p>
            </div>
          </div>
        </div>

        {/* Cột 2: Thông tin công tác & Tài khoản */}
        <div className="bg-background rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">Thông tin công tác</h3>
          
          <div className="flex items-center gap-3 text-muted-foreground">
            <Briefcase className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Vai trò hệ thống</p>
              <p className="text-sm font-medium text-foreground">{teacher.TaiKhoan?.VAITRO || "---"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <KeyRound className="text-primary/70" size={20} />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Tên đăng nhập</p>
              <p className="text-sm font-medium text-foreground">{teacher.TaiKhoan?.TENDANGNHAP || "Chưa cấp"}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}