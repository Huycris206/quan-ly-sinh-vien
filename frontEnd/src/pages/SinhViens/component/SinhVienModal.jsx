import React from "react";

// 1. Nhận thêm chuyenNganhs vào Props
const SinhVienModal = ({ isAddingMode, editingStudent, onClose, onAddSubmit, onEditSubmit, chuyenNganhs }) => {
  if (!isAddingMode && !editingStudent) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-background p-6 rounded-xl w-full max-w-2xl shadow-xl border border-border max-h-[90vh] overflow-y-auto slide-in-from-bottom-4 animate-in duration-300">
        
        <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-3">
          {isAddingMode ? "Thêm Sinh Viên Mới" : `Cập nhật mã SV: ${editingStudent.MASV}`}
        </h3>
        
        <form onSubmit={isAddingMode ? onAddSubmit : onEditSubmit} className="space-y-4">
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

            {/* THAY ĐỔI: DÙNG SELECT CHO CHUYÊN NGÀNH BẰNG TÊN CHUYÊN NGÀNH */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Chuyên ngành <span className="text-destructive">*</span></label>
              <select 
                required 
                name="CHUYENNGANH_ID" 
                defaultValue={editingStudent?.CHUYENNGANH_ID || ""} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="" disabled>-- Chọn chuyên ngành --</option>
                
                {/* Vòng lặp in ra danh sách chuyên ngành */}
                {chuyenNganhs && chuyenNganhs.map((cn) => (
                  <option key={cn.ID} value={cn.ID}>
                    {cn.TENCHUYENNGANH}
                  </option>
                ))}
                
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Số điện thoại</label>
              <input name="SDT" defaultValue={editingStudent?.SDT || ""} type="tel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="090..." />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Khóa học</label>
              <input name="KHOAHOC" 
              defaultValue={editingStudent?.KHOAHOC || ""} 
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              placeholder="VD: K45" />
            </div>

            {editingStudent && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Trạng thái học tập</label>
                <select name="TRANGTHAI" defaultValue={editingStudent.TRANGTHAI} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="DangHoc">Đang học</option>
                  <option value="BaoLuu">Bảo lưu</option>
                  <option value="TotNghiep">Tốt nghiệp</option>
                  <option value="ThoiHoc">Thôi học</option>
                </select>
              </div>
            )}
            
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-border">
            <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4">
              Hủy bỏ
            </button>
            <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 shadow-sm">
              {isAddingMode ? "Lưu sinh viên" : "Cập nhật thay đổi"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SinhVienModal;