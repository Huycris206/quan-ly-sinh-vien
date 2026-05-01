import React, { useState } from 'react';
import SinhVienCard from './SinhVienCard'; 
import Loadingcomp from '@/components/ui/Loading.jsx'; 
import { useSinhViens } from '@/hooks/useSinhViens.jsx';

const SinhVienList = () => {
  // 1. Khai báo state quản lý bộ lọc
  const [filterStatus, setFilterStatus] = useState('All'); 
  
  // 2. Lấy dữ liệu từ Hook
  const { sinhViens, loading, error, refetch } = useSinhViens();

  // 3. Xử lý giao diện khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loadingcomp caigi="danh sách sinh viên" />
      </div>
    );
  }

  // 4. Xử lý giao diện khi có lỗi từ server (Đổi sang dùng màu destructive của Shadcn)
  if (error) {
    return (
      <div className="text-center p-10 bg-destructive/10 rounded-xl border border-destructive/20 mt-8">
        <p className="text-destructive font-medium">{error}</p>
        <button 
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors text-sm font-medium"
        >
          Tải lại dữ liệu
        </button>
      </div>
    );
  }

  // 5. Lọc danh sách sinh viên theo trạng thái
  const displaySinhViens = sinhViens.filter(sv => 
    filterStatus === 'All' || sv.TRANGTHAI === filterStatus
  );

  return (
    <div className="py-6 px-4 md:px-8">
      {/* Header của trang */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Quản lý Sinh viên</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Hiển thị {displaySinhViens.length} / {sinhViens.length} sinh viên
          </p>
        </div>
        
        {/* Nút Thêm mới */}
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition shadow-sm">
          + Thêm sinh viên
        </button>
      </div>

      {/* Bộ lọc Trạng thái (Đã sửa lại Value cho khớp DB và Tone màu Shadcn) */}
      <div className="mb-8 flex flex-wrap gap-3">
        {['All', 'DangHoc', 'BaoLuu', 'TotNghiep'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-md font-medium transition-colors text-sm border ${
              filterStatus === status 
                ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground border-border'
            }`}
          >
            {status === 'All' ? 'Tất cả' : 
             status === 'DangHoc' ? 'Đang học' : 
             status === 'BaoLuu' ? 'Bảo lưu' : 'Đã tốt nghiệp'}
          </button>
        ))}
      </div>

      {/* Khu vực hiển thị danh sách Card */}
      {sinhViens.length === 0 ? (
        <div className="text-center py-16 bg-background rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground font-medium text-sm">Hệ thống chưa có dữ liệu sinh viên nào.</p>
        </div>
      ) : displaySinhViens.length === 0 ? (
        <div className="text-center py-16 bg-background rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground font-medium text-sm">Không tìm thấy sinh viên nào với trạng thái này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displaySinhViens.map((sinhVien) => (
            <SinhVienCard 
              key={sinhVien.ID} 
              sinhVien={sinhVien} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SinhVienList;