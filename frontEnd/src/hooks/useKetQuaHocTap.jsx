import { useState } from "react";
import axios from "axios";

export const useKetQuaHocTap = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  
  // Lưu ý: Thay đổi 'ketquahoctap' thành đường dẫn prefix thực tế trong file server.js của bạn
  // Ví dụ: app.use('/api/diem', ketQuaHocTapRoutes) thì đổi thành "http://localhost:5001/api/diem"
  const API_URL = "http://localhost:5001/api/ketquahoctap";

  const headers = { Authorization: `Bearer ${token}` };

  // 1. LẤY BẢNG ĐIỂM CỦA 1 LỚP HỌC PHẦN
  const fetchDiemByLopHocPhan = async (lopHocPhanId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/lophocphan/${lopHocPhanId}`, { headers });
      return response.data.data; 
    } catch (err) {
      console.error("Lỗi khi lấy bảng điểm lớp học phần:", err);
      setError("Không thể lấy dữ liệu điểm của lớp.");
      return []; 
    } finally {
      setLoading(false);
    }
  };

  // 2. LẤY BẢNG ĐIỂM CÁ NHÂN CỦA 1 SINH VIÊN
  const fetchBangDiemCaNhan = async (sinhVienId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/sinhvien/${sinhVienId}`, { headers });
      return response.data.data;
    } catch (err) {
      console.error("Lỗi khi lấy bảng điểm cá nhân:", err);
      setError("Không thể lấy dữ liệu điểm cá nhân.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 3. LẤY ĐIỂM CHI TIẾT CỦA 1 SINH VIÊN TRONG 1 LỚP
  const fetchDiemSinhVienTrongLop = async (lopHocPhanId, sinhVienId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/chitiet/${lopHocPhanId}/${sinhVienId}`, { headers });
      return response.data.data;
    } catch (err) {
      console.error("Lỗi khi lấy điểm chi tiết:", err);
      // Nếu là lỗi 404 (Không tìm thấy), ta trả về null thay vì văng lỗi lớn
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 4. CẬP NHẬT ĐIỂM SINH VIÊN (Gọi Stored Procedure)
  const updateDiem = async (updateData) => {
    // updateData cần có cấu trúc: { SINHVIEN_ID, LOPHOCPHAN_ID, DIEMCHUYENCAN, DIEMGIUAKY, DIEMCUOIKY }
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/update-diem`, updateData, { headers });
      
      if (res.data.success) {
        alert(res.data.message || "Cập nhật điểm thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi cập nhật điểm:", err);
      const errorMessage = err.response?.data?.message || "Lỗi khi cập nhật điểm. Vui lòng kiểm tra lại!";
      alert(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };



  return {
    loading,
    error,
    fetchDiemByLopHocPhan,
    fetchBangDiemCaNhan,
    fetchDiemSinhVienTrongLop,
    updateDiem,
    
  };
};