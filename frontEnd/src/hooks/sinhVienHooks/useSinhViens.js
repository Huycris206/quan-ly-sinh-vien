import { useEffect, useState } from "react";
import axios from "axios";

export const useSinhViens = () => {
  const [sinhViens, setSinhViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  const fetchSinhViens = async () => {
    try {
      setLoading(true);
      setError(null);

      // Chỉ cần gọi ĐÚNG 1 API duy nhất
      const response = await axios.get("http://localhost:5001/api/sinhvien");

      // Chọc sâu vào .data.data như đã giải thích ở trên
      setSinhViens(response.data.data); 
      
    } catch (err) {
      console.error("Lỗi khi lấy danh sinh viên:", err);
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };
  const deleteSinhVien = async (id) => {
    // Hỏi xác nhận trước khi xóa
    if (!window.confirm("Bạn chắc chắn muốn xóa sinh viên này khỏi hệ thống?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/sinhvien/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Xóa thành công ở Backend -> Lọc bỏ sinh viên đó khỏi State ở Frontend
      // Cách này giúp giao diện cập nhật ngay lập tức mà không cần gọi lại API fetchSinhViens
      setSinhViens((prevList) => prevList.filter((sv) => sv.ID !== id));
      
      alert("Đã xóa sinh viên thành công!");
    } catch (err) {
      console.error("Lỗi xóa sinh viên:", err);
      alert("Lỗi khi xóa sinh viên. Vui lòng thử lại!");
    }
  };

  const updateSinhVien = async (id, updateData) => {
    try {
      // Vì API backend của bạn dùng phương thức PUT (hoặc PATCH) để update
      const res = await axios.put(`http://localhost:5001/api/sinhvien/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // Cập nhật lại state ở Frontend để giao diện đổi ngay lập tức
        setSinhViens((prevList) => 
          prevList.map((sv) => 
            // Tìm đúng ID sinh viên vừa sửa, ghi đè các trường dữ liệu mới (updateData) vào
            sv.ID === id ? { ...sv, ...updateData } : sv
          )
        );
        alert("Cập nhật thông tin thành công!");
        return true; // Trả về true để Component biết là đã thành công (đóng Modal, tắt form...)
      }
    } catch (err) {
      console.error("Lỗi cập nhật sinh viên:", err);
      alert("Lỗi khi cập nhật. Vui lòng kiểm tra lại!");
      return false;
    }
  };

  const createSinhVien = async (newData) => {
    try {
      const res = await axios.post("http://localhost:5001/api/sinhvien", newData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        // Thêm sinh viên mới vào state để giao diện cập nhật ngay
        setSinhViens((prevList) => [...prevList, res.data.data]); // Giả sử API trả về đối tượng sinh viên vừa tạo trong res.data.data
        alert("Thêm sinh viên thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi thêm sinh viên:", err);
      alert("Lỗi khi thêm sinh viên. Vui lòng kiểm tra lại!");
      return false;
    }
  };

  useEffect(() => {
    fetchSinhViens();
  }, []);

  return { sinhViens, loading, error, refetch: fetchSinhViens,deleteSinhVien,updateSinhVien,createSinhVien };
};