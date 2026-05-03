import React, { useState } from "react";
import { Users, UserPlus, Search } from "lucide-react"; // Đã thêm icon Search
import BangDiemTable from "./BangDiemTable"; 
import { useSinhViens } from "@/hooks/sinhVienHooks/useSinhViens"; 
import { useKetQuaHocTap } from "@/hooks/useKetQuaHocTap";

const SinhVienLopManager = ({ 
  lopHocPhanId, 
  danhSachDiem = [], 
  loadingData, 
  sisoToiDa, 
  onRefresh,      
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSV, setSelectedSV] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // STATE MỚI: Lưu trữ từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  const { sinhViens: allSinhViens = [] } = useSinhViens();
  const { dangKyMonHoc, updateDiem, loading: isGradeLoading } = useKetQuaHocTap();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSV) return alert("Vui lòng chọn một sinh viên!");

    setIsSubmitting(true);
    const success = await dangKyMonHoc({
      SINHVIEN_ID: selectedSV,
      LOPHOCPHAN_ID: lopHocPhanId
    });
    setIsSubmitting(false);

    if (success) {
      setIsModalOpen(false);
      setSelectedSV("");
      if (onRefresh) onRefresh(); 
    }
  };

  const handleSaveGrade = async (gradeData) => {
    const success = await updateDiem(gradeData);
    if (success && onRefresh) {
      onRefresh(); 
    }
  };

  // LOGIC LỌC DỮ LIỆU TÌM KIẾM
  const filteredDanhSachDiem = danhSachDiem?.filter((sv) => {
    if (!searchTerm) return true; // Nếu không nhập gì thì giữ nguyên danh sách
    
    const term = searchTerm.toLowerCase();
    const maSV = sv.MASV?.toLowerCase() || "";
    const hoTen = sv.HOTEN?.toLowerCase() || "";
    
    return maSV.includes(term) || hoTen.includes(term);
  }) || [];

  return (
    <div className="bg-background rounded-xl border border-border shadow-sm flex flex-col overflow-hidden max-h-[600px]">
      
      {/* HEADER: Tiêu đề + Tìm kiếm + Nút thêm */}
      <div className="p-5 border-b border-border bg-muted/20 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        
        {/* Phía trái: Tiêu đề & Sĩ số */}
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Quản lý Điểm Sinh Viên
          </h3>
          {!loadingData && danhSachDiem?.length > 0 && (
            <span className="bg-primary/10 text-primary py-0.5 px-2 rounded-full text-xs font-bold">
              {danhSachDiem.length} / {sisoToiDa || 70}
            </span>
          )}
        </div>

        {/* Phía phải: Thanh tìm kiếm & Nút */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Ô input tìm kiếm */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo Mã SV, Họ tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            <UserPlus size={16} />
            Thêm SV vào lớp
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto relative p-4">
        {loadingData ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <span className="text-sm text-muted-foreground animate-pulse">Đang tải bảng điểm...</span>
          </div>
        ) : filteredDanhSachDiem?.length > 0 ? (
          <div className="w-full">
            <BangDiemTable
              danhSachDiem={filteredDanhSachDiem} // Truyền danh sách ĐÃ LỌC xuống bảng
              onSaveDiem={handleSaveGrade}
              isSaving={isGradeLoading} 
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 text-center">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              {searchTerm ? "Không tìm thấy sinh viên nào khớp với từ khóa." : "Lớp học phần này hiện chưa có sinh viên nào."}
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background p-6 rounded-xl w-full max-w-md shadow-xl border border-border">
            <h3 className="text-lg font-bold mb-4 text-foreground border-b border-border pb-3">
              Thêm sinh viên vào lớp
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Chọn Sinh Viên <span className="text-destructive">*</span></label>
                <select 
                  required 
                  value={selectedSV}
                  onChange={(e) => setSelectedSV(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="" disabled>-- Tìm kiếm và chọn sinh viên --</option>
                  {allSinhViens?.map((sv) => (
                    <option key={sv.ID} value={sv.ID}>
                      {sv.MASV} - {sv.HOTEN}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  {isSubmitting ? "Đang xử lý..." : "Lưu vào lớp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinhVienLopManager;