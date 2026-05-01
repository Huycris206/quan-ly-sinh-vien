import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLopHocPhans } from "../../hooks/useLopHocPhans"; // Check lại đường dẫn
import Loadingcomp from "@/components/ui/Loading.jsx";
import { 
  ArrowLeft, BookOpen, UserCircle, 
  Users, Calendar, Info
} from "lucide-react";
import SinhVienTable from "../SinhViens/SinhVienTable";

export default function LopHocPhanDetail() {
  // 1. Lấy mã lớp từ URL (ví dụ: /lophocphans/SE101.M11 -> id = SE101.M11)
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [sinhViens, setSinhViens] = useState([]);
  const [loadingSV, setLoadingSV] = useState(false);

  
  
  // 2. Lấy dữ liệu từ Hook
  const { lopHocPhans, loading, error, fetchSinhViensByLopHocPhan } = useLopHocPhans();

  // 3. Tìm lớp học phần khớp với MALOP trên URL
  const lopHocPhan = lopHocPhans.find((lop) => lop.MALOP?.toLowerCase() === id?.toLowerCase());

  useEffect(() => {
    const loadSinhViens = async () => {
        if (!lopHocPhan?.ID) return;

        setLoadingSV(true);
        const data = await fetchSinhViensByLopHocPhan(lopHocPhan.ID);
        setSinhViens(data);
        setLoadingSV(false);
    };

    loadSinhViens();
}, [lopHocPhan]);

  // =================== RENDER TRẠNG THÁI ===================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loadingcomp caigi="chi tiết lớp học phần" />
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

  if (!lopHocPhan) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-8 text-center bg-background rounded-xl border border-border shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-2">Không tìm thấy Lớp học phần</h2>
        <p className="text-muted-foreground mb-6">Mã lớp <strong className="text-primary uppercase">{id}</strong> không tồn tại trong hệ thống.</p>
        <button onClick={() => navigate('/lophocphans')} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
          <ArrowLeft size={16} /> Về danh sách
        </button>
      </div>
    );
  }

  // =================== RENDER GIAO DIỆN CHÍNH ===================
  return (
    <div className="py-6 px-4 md:px-8 max-w-6xl mx-auto w-full">
      
      {/* Nút Quay Lại */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      {/* HEADER CHI TIẾT LỚP */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Chi tiết lớp: <span className="text-primary uppercase">{lopHocPhan.MALOP}</span>
          </h2>
          <p className="text-muted-foreground text-sm flex items-center gap-2 mt-2">
            <BookOpen className="w-4 h-4" /> 
            {lopHocPhan.MonHoc?.TENMONHOC || "Đang cập nhật môn học"} 
            ({lopHocPhan.MonHoc?.SOTINCHI ? `${lopHocPhan.MonHoc.SOTINCHI} tín chỉ` : '---'})
          </p>
        </div>
        
        {/* Trạng thái lớp */}
        <div>
          <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold shadow-sm ${
            lopHocPhan.TRANGTHAI === 'Mo' ? 'bg-blue-100/90 text-blue-700 border-blue-200' : 
            lopHocPhan.TRANGTHAI === 'DangHoc' ? 'bg-green-100/90 text-green-700 border-green-200' : 
            lopHocPhan.TRANGTHAI === 'KetThuc' ? 'bg-gray-100/90 text-gray-700 border-gray-200' : 
            lopHocPhan.TRANGTHAI === 'Dong' ? 'bg-orange-100/90 text-orange-700 border-orange-200' : 
            'bg-destructive/10 text-destructive border-destructive/20'
          }`}>
            {
              lopHocPhan.TRANGTHAI === 'Mo' ? 'Đang mở (Đăng ký)' : 
              lopHocPhan.TRANGTHAI === 'DangHoc' ? 'Đang học' : 
              lopHocPhan.TRANGTHAI === 'KetThuc' ? 'Kết thúc' : 
              lopHocPhan.TRANGTHAI === 'Dong' ? 'Đã đóng' : 'Đã hủy'
            }
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI: Thông tin Giảng viên & Lớp */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Thông tin Giảng viên */}
          <div className="bg-background rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-semibold text-lg border-b border-border pb-2 mb-4 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" /> Phụ trách giảng dạy
            </h3>
            
            {lopHocPhan.GiangVien ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Họ và Tên</p>
                  <p className="font-medium text-foreground">{lopHocPhan.GiangVien.HOTEN}</p>
                </div>
                {/* Lưu ý: Nếu hook getAll chỉ lấy HOTEN thì MAGV và SDT dưới đây sẽ undefined */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">Mã GV</p>
                  <p className="font-medium text-foreground uppercase">{lopHocPhan.GiangVien.MAGV || '---'}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic text-sm">Lớp chưa được phân công giảng viên.</p>
            )}
          </div>

          {/* Cấu hình lớp */}
          <div className="bg-background rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-semibold text-lg border-b border-border pb-2 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" /> Cấu hình lớp
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4"/> Học kỳ:</span> 
                <span className="font-medium">{lopHocPhan.HOCKY || "---"}</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4"/> Sĩ số tối đa:</span> 
                <span className="font-medium">{lopHocPhan.SISO_TOIDA || 70}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CỘT PHẢI: Danh sách sinh viên */}
        <div className="md:col-span-2 bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Danh sách sinh viên
            </h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
             <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
             </div>
             <div className="p-4">
                {loadingSV ? (
                    <p className="text-center text-muted-foreground">Đang tải danh sách sinh viên...</p>
                ) : (
                    <SinhVienTable
                    sinhViens={sinhViens}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    />
                )}
            </div>
             
               
          </div>
        </div>

      </div>
    </div>
  );
}