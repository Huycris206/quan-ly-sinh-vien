import React from "react";

// 1. Nhận thêm giangViens và monHocs ở props
const LopHocPhanModal = ({ isAddingMode, editingClass, onClose, onAddSubmit, onEditSubmit, giangViens, monHocs }) => {
  if (!isAddingMode && !editingClass) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-background p-6 rounded-xl w-full max-w-2xl shadow-xl border border-border max-h-[90vh] overflow-y-auto slide-in-from-bottom-4 animate-in duration-300">
        
        <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-3">
          {isAddingMode ? "Mở Lớp Học Phần Mới" : `Cập nhật lớp: ${editingClass.MALOP}`}
        </h3>
        
        <form onSubmit={isAddingMode ? onAddSubmit : onEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* THAY ĐỔI 1: CHỌN MÔN HỌC BẰNG SELECT */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Môn Học <span className="text-destructive">*</span></label>
              <select required name="MONHOC_ID" defaultValue={editingClass?.MONHOC_ID || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="" disabled>-- Chọn môn học --</option>
                {monHocs.map((mh) => (
                  <option key={mh.ID} value={mh.ID}>
                    {mh.TENMONHOC} ({mh.SOTINCHI} TC)
                  </option>
                ))}
              </select>
            </div>

            {/* THAY ĐỔI 2: CHỌN GIẢNG VIÊN BẰNG SELECT */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Giảng Viên</label>
              <select name="GIANGVIEN_ID" defaultValue={editingClass?.GIANGVIEN_ID || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">-- Chưa phân công --</option>
                {giangViens.map((gv) => (
                  <option key={gv.ID} value={gv.ID}>
                    {gv.HOTEN} ({gv.MAGV})
                  </option>
                ))}
              </select>
            </div>

            {/* Các trường còn lại (Sĩ số, Trạng thái...) giữ nguyên như cũ */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Sĩ số tối đa</label>
              <input name="SISO_TOIDA" defaultValue={editingClass?.SISO_TOIDA || 70} type="number" min="1" max="200"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              />
            </div>

            {editingClass && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Học Kỳ</label>
                  <input readOnly defaultValue={editingClass.HOCKY} type="text" 
                    className="flex h-10 w-full rounded-md border border-input bg-muted text-muted-foreground px-3 py-2 text-sm cursor-not-allowed" 
                    title="Học kỳ do hệ thống tự sinh, không thể sửa"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Trạng thái</label>
                  <select name="TRANGTHAI" defaultValue={editingClass.TRANGTHAI || "Mo"} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="Mo">Mở (Cho phép đăng ký)</option>
                    <option value="DangHoc">Đang học</option>
                    <option value="KetThuc">Kết thúc</option>
                    <option value="Dong">Đóng (Khóa)</option>
                    <option value="Huy">Hủy lớp</option>
                  </select>
                </div>
              </>
            )}

            {isAddingMode && (
               <div className="col-span-1 md:col-span-2 pt-2">
                 <p className="text-xs text-muted-foreground italic">* Mã lớp và Học kỳ sẽ được hệ thống tạo tự động dựa vào thời gian hiện tại.</p>
               </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-border">
            <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4">
              Hủy bỏ
            </button>
            <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 shadow-sm">
              {isAddingMode ? "Tạo lớp học phần" : "Cập nhật thay đổi"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LopHocPhanModal;