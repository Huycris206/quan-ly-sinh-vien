import React, { useState } from "react";
import { Users, UserPlus } from "lucide-react";
import SinhVienTable from "../SinhViens/component/SinhVienTable";
// Import hook lấy ALL sinh viên để đổ vào dropdown
import { useSinhViens } from "@/hooks/sinhVienHooks/useSinhViens"; 

const SinhVienLopManager = ({ 
  lopHocPhanId, 
  sinhViensDanhSach, // Danh sách SV đang học lớp này
  loadingSV, 
  sisoToiDa, 
  onRefresh, // Hàm gọi lại để load lại danh sách sau khi thêm thành công
  dangKyLopHocPhan // Hàm API vừa tạo ở Bước 1
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSV, setSelectedSV] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy danh sách toàn bộ sinh viên trong trường để chọn
  const { sinhViens: allSinhViens } = useSinhViens();

  // Xử lý khi bấm Lưu (Đăng ký môn)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSV) return alert("Vui lòng chọn một sinh viên!");

    setIsSubmitting(true);
    const success = await dangKyLopHocPhan(selectedSV, lopHocPhanId);
    setIsSubmitting(false);

    if (success) {
      setIsModalOpen(false);
      setSelectedSV("");
      onRefresh(); // Báo cho component Cha (LopHocPhanDetail) tải lại danh sách
    }
  };

  return (
    <div className="bg-background rounded-xl border border-border shadow-sm flex flex-col overflow-hidden max-h-[600px]">
      
      {/* Header Bảng & Nút Thêm */}
      <div className="p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Danh sách sinh viên
          </h3>
          {!loadingSV && sinhViensDanhSach.length > 0 && (
            <span className="bg-primary/10 text-primary py-0.5 px-2 rounded-full text-xs font-bold">
              {sinhViensDanhSach.length} / {sisoToiDa || 70}
            </span>
          )}
        </div>

        {/* Nút bật Modal thêm sinh viên */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <UserPlus size={16} />
          Thêm SV vào lớp
        </button>
      </div>
      
      {/* Khu vực chứa Bảng */}
      <div className="flex-1 overflow-auto relative">
        {loadingSV ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <span className="text-sm text-muted-foreground animate-pulse">Đang tải danh sách sinh viên...</span>
          </div>
        ) : sinhViensDanhSach.length > 0 ? (
          <div className="w-full">
            <SinhVienTable
              sinhViens={sinhViensDanhSach}
              onEdit={() => {}} 
              onDelete={() => {}}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 text-center">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Lớp học phần này hiện chưa có sinh viên nào.</p>
          </div>
        )}
      </div>

      {/* MODAL CHỌN SINH VIÊN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-background p-6 rounded-xl w-full max-w-md shadow-xl border border-border slide-in-from-bottom-4 animate-in duration-300">
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>-- Tìm kiếm và chọn sinh viên --</option>
                  {allSinhViens.map((sv) => (
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
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm flex items-center gap-2"
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