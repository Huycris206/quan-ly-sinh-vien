import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGiangViens } from "@/hooks/useGiangViens";
import Loadingcomp from "@/components/ui/Loading.jsx";
import { 
  ArrowLeft, Phone, Calendar, 
  CreditCard, User, Briefcase, KeyRound, BookOpen 
} from "lucide-react";

export default function GiangVienDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // 1. Import hàm fetch mới từ hook
  const { giangViens, loading, error, fetchLopHocPhanByGiangVien } = useGiangViens();
  
  // 2. State để lưu trữ danh sách lớp học phần
  const [classesTaught, setClassesTaught] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Tìm giảng viên hiện tại
  const teacher = giangViens.find((gv) => gv.MAGV?.toLowerCase() === id?.toLowerCase());

  // 3. Dùng useEffect để lấy danh sách lớp khi tìm thấy giảng viên
  useEffect(() => {
    const getClasses = async () => {
      if (teacher && teacher.ID) {
        setLoadingClasses(true);
        const data = await fetchLopHocPhanByGiangVien(teacher.ID);
        setClassesTaught(data);
        setLoadingClasses(false);
      }
    };

    getClasses();
  }, [teacher]); // Chạy lại khi đối tượng teacher thay đổi

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ... (Giữ nguyên phần Cột 1 và Cột 2 như code cũ của bạn) ... */}
        {/* Mình cắt bớt đoạn này cho gọn, bạn cứ copy y nguyên code cũ vào đây nhé */}
        
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
          {/* ... các thẻ thông tin khác ... */}
        </div>

        {/* Cột 2: Thông tin công tác */}
        <div className="bg-background rounded-xl border border-border shadow-sm p-6 space-y-4">
           <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">Thông tin công tác</h3>
           {/* ... các thẻ thông tin khác ... */}
        </div>
      </div>

      {/* 4. KHU VỰC HIỂN THỊ DANH SÁCH LỚP HỌC PHẦN ĐƯỢC PHÂN CÔNG */}
      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
          <BookOpen className="text-primary" size={22} />
          <h3 className="text-lg font-bold text-foreground">Lớp học phần phụ trách</h3>
          {!loadingClasses && (
             <span className="ml-auto bg-primary/10 text-primary py-0.5 px-2 rounded-full text-xs font-bold">
               {classesTaught.length} lớp
             </span>
          )}
        </div>

        {loadingClasses ? (
           <div className="flex justify-center py-8">
              <span className="text-sm text-muted-foreground animate-pulse">Đang tải danh sách lớp...</span>
           </div>
        ) : classesTaught.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classesTaught.map((lop) => (
              <div 
                key={lop.LOPHOCPHAN_ID} 
                className="border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all bg-card"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-foreground line-clamp-1" title={lop.TENMONHOC}>
                    {lop.TENMONHOC}
                  </h4>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                      lop.TRANGTHAI_LOP === 'Mo' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    {lop.MALOP}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Học kỳ: <strong className="text-foreground">{lop.HOCKY}</strong></p>
                  <p>Tín chỉ: {lop.SOTINCHI}</p>
                  <p>Sĩ số: <strong className="text-foreground">{lop.SISO || 0} / {lop.SISO_TOIDA}</strong></p>
                  
                  {/* Nếu bạn dùng cái View nâng cao có gộp lịch học thì mở comment dòng dưới ra */}
                  {/* {lop.THOIKHOABIEU && <p className="pt-2 mt-2 border-t text-xs">Lịch: {lop.THOIKHOABIEU}</p>} */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
            <BookOpen size={32} className="mx-auto mb-2 opacity-20" />
            <p>Giảng viên này hiện chưa phụ trách lớp học phần nào.</p>
          </div>
        )}
      </div>

    </div>
  );
}