import { useEffect, useState } from "react";
import axios from "axios";

export const useGiangViens = () => {
  const [giangViens, setGiangViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  // 1. LẤY DANH SÁCH GIẢNG VIÊN
  const fetchGiangViens = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5001/api/giangvien", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGiangViens(response.data.data); 
    } catch (err) {
      console.error("Lỗi khi lấy danh sách giảng viên:", err);
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // 2. XÓA GIẢNG VIÊN (Giữ nguyên)
  const deleteGiangVien = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa giảng viên này khỏi hệ thống?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/giangvien/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGiangViens((prevList) => prevList.filter((gv) => gv.ID !== id));
      alert("Đã xóa giảng viên thành công!");
    } catch (err) {
      console.error("Lỗi xóa giảng viên:", err);
      alert("Lỗi khi xóa giảng viên. Vui lòng thử lại!");
    }
  };

  // 3. CẬP NHẬT GIẢNG VIÊN (Giữ nguyên)
  const updateGiangVien = async (id, updateData) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/giangvien/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setGiangViens((prevList) => 
          prevList.map((gv) => gv.ID === id ? { ...gv, ...updateData } : gv)
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

  // 4. THÊM MỚI GIẢNG VIÊN (Giữ nguyên)
  const createGiangVien = async (newData) => {
    try {
      const res = await axios.post("http://localhost:5001/api/giangvien", newData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setGiangViens((prevList) => [res.data.data, ...prevList]); 
        alert("Thêm giảng viên thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi thêm giảng viên:", err);
      const errorMessage = err.response?.data?.message || "Lỗi khi thêm giảng viên. Vui lòng kiểm tra lại!";
      alert(errorMessage);
      return false;
    }
  };

  // 5. THÊM MỚI: LẤY DANH SÁCH LỚP HỌC PHẦN CỦA GIẢNG VIÊN (TỪ VIEW)
  const fetchLopHocPhanByGiangVien = async (giangVienId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/giangvien/${giangVienId}/lophocphan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // Trả về mảng dữ liệu lớp học phần
    } catch (err) {
      console.error("Lỗi khi lấy danh sách lớp của giảng viên:", err);
      return []; // Trả về mảng rỗng nếu lỗi
    }
  };

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
    createGiangVien,
    fetchLopHocPhanByGiangVien // Export hàm mới ra để dùng
  };
};