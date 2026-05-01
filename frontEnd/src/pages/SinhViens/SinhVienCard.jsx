import { Link } from "react-router-dom";

const SinhVienCard = ({ sinhVien }) => {
  // Lấy dữ liệu từ Model đã populate (Nhớ kiểm tra case-sensitive)
  const taiKhoan = sinhVien.TaiKhoan || {};
  const chuyenNganh = sinhVien.ChuyenNganh || {};
    console.log("Soi thử 1 sinh viên:", sinhVien);
  return (
    <div className="bg-background rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
      
      {/* Phần Ảnh Avatar */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
        <img
          src={taiKhoan?.ANHDAIDIEN || "/placeholder-room.jpg"} 
          alt={sinhVien.HOTEN}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Badge trạng thái đè lên ảnh góc phải trên */}
        <div className="absolute top-3 right-3">
          <span 
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm backdrop-blur-sm ${
              sinhVien.TRANGTHAI === 'DangHoc' 
                ? 'bg-green-100/90 text-green-700 border-green-200' // Giữ màu xanh cho dễ nhận biết Đang học
                : 'bg-destructive/10 text-destructive border-destructive/20' // Dùng màu lỗi (đỏ) của Shadcn
            }`}
          >
            {sinhVien.TRANGTHAI === 'DangHoc' ? 'Đang học' : 'Bảo lưu/Tốt nghiệp'}
          </span>
        </div>
      </div>

      {/* Phần Thông tin */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-1" title={sinhVien.HOTEN}>
            {sinhVien.HOTEN}
          </h3>
          <p className="text-sm font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">
            {sinhVien.MASV}
          </p>
        </div>

        {/* Chuyên ngành */}
        <div className="pt-2 mt-auto">
          <div className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary w-full justify-center">
            {chuyenNganh.TENCHUYENNGANH || "Chưa phân chuyên ngành"}
          </div>
        </div>

        {/* Nút Xem chi tiết */}
        <Link
          to={`/students/${sinhVien.MASV}`} // Chỉnh lại route cho chuẩn tiếng Anh (students thay vì sinhviens)
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2"
        >
          Xem hồ sơ
        </Link>
      </div>
    </div>
  );
};

export default SinhVienCard;