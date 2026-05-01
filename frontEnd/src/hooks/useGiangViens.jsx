import { useEffect, useState } from "react";
import axios from "axios";

export const useGiangViens = () => {
  const [giangViens, setGiangViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy token từ localStorage để đính kèm vào Headers (nếu API có bảo mật)
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  // 1. LẤY DANH SÁCH GIẢNG VIÊN
  const fetchGiangViens = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lưu ý: Đảm bảo route trong file route của Express là /api/giangvien
      const response = await axios.get("http://localhost:5001/api/giangvien", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // API Backend trả về { success: true, data: [...] } nên chọc vào .data.data
      setGiangViens(response.data.data); 
      
    } catch (err) {
      console.error("Lỗi khi lấy danh sách giảng viên:", err);
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // 2. XÓA GIẢNG VIÊN
  const deleteGiangVien = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa giảng viên này khỏi hệ thống?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/giangvien/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Lọc bỏ giảng viên vừa xóa khỏi State Frontend (Không cần gọi lại API GET)
      setGiangViens((prevList) => prevList.filter((gv) => gv.ID !== id));
      
      alert("Đã xóa giảng viên thành công!");
    } catch (err) {
      console.error("Lỗi xóa giảng viên:", err);
      alert("Lỗi khi xóa giảng viên. Vui lòng thử lại!");
    }
  };

  // 3. CẬP NHẬT GIẢNG VIÊN
  const updateGiangVien = async (id, updateData) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/giangvien/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // Cập nhật lại state ở Frontend
        setGiangViens((prevList) => 
          prevList.map((gv) => 
            gv.ID === id ? { ...gv, ...updateData } : gv
          )
        );
        alert("Cập nhật thông tin thành công!");
        return true; 
      }
    } catch (err) {
      console.error("Lỗi cập nhật giảng viên:", err);
      alert("Lỗi khi cập nhật. Vui lòng kiểm tra lại!");
      return false;
    }
  };

  // 4. THÊM MỚI GIẢNG VIÊN
  const createGiangVien = async (newData) => {
    try {
      const res = await axios.post("http://localhost:5001/api/giangvien", newData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        // Đẩy giảng viên mới lên ĐẦU danh sách hiển thị
        setGiangViens((prevList) => [res.data.data, ...prevList]); 
        alert("Thêm giảng viên thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi thêm giảng viên:", err);
      // Bắt lỗi cụ thể từ Backend (ví dụ: "Thiếu CCCD để tạo Mã Giảng Viên!")
      const errorMessage = err.response?.data?.message || "Lỗi khi thêm giảng viên. Vui lòng kiểm tra lại!";
      alert(errorMessage);
      return false;
    }
  };

  // Tự động gọi API lấy danh sách lần đầu khi component mount
  useEffect(() => {
    fetchGiangViens();
  }, []);

  return { 
    giangViens, 
    loading, 
    error, 
    refetch: fetchGiangViens,
    deleteGiangVien,
    updateGiangVien,
    createGiangVien 
  };
};