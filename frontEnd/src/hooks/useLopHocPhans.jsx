import { useEffect, useState } from "react";
import axios from "axios";
import { da } from "zod/locales";

export const useLopHocPhans = () => {
  const [lopHocPhans, setLopHocPhans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy token từ localStorage (nếu API có bảo mật bằng JWT)
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  // ==========================================
  // 1. LẤY DANH SÁCH LỚP HỌC PHẦN
  // ==========================================
  const fetchLopHocPhans = async () => {
    try {
      setLoading(true);
      setError(null);

      // Nhớ check lại route backend xem có đúng là /api/lophocphan không nhé
      const response = await axios.get("http://localhost:5001/api/lophocphan", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Lấy mảng dữ liệu từ response.data.data
      setLopHocPhans(response.data.data); 
      
    } catch (err) {
      console.error("Lỗi khi lấy danh sách lớp học phần:", err);
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };
  const fetchSinhViensByLopHocPhan = async (lopHocPhanId) => {
    try {
      setLoading(true);
      setError(null);
        const response = await axios.get(`http://localhost:5001/api/lophocphan/${lopHocPhanId}/sinhviens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; 
    } catch (err) {
      console.error("Lỗi khi lấy danh sách sinh viên theo lớp học phần:", err);
      setError("Không thể kết nối đến máy chủ.");
      return [];
    } finally {
      setLoading(false);

    }
}

  // ==========================================
  // 2. THÊM MỚI LỚP HỌC PHẦN
  // ==========================================
  const createLopHocPhan = async (newData) => {
    try {
      const res = await axios.post("http://localhost:5001/api/lophocphan", newData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        // Đẩy lớp học phần mới lên đầu mảng
        setLopHocPhans((prevList) => [res.data.data, ...prevList]); 
        alert("Thêm lớp học phần thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi thêm lớp học phần:", err);
      // Bắt thông báo lỗi từ backend (vd: "Mã lớp học phần đã tồn tại!")
      const errorMessage = err.response?.data?.message || "Lỗi khi thêm lớp học phần. Vui lòng thử lại!";
      alert(errorMessage);
      return false;
    }
  };

  // ==========================================
  // 3. CẬP NHẬT LỚP HỌC PHẦN
  // ==========================================
  const updateLopHocPhan = async (id, updateData) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/lophocphan/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setLopHocPhans((prevList) => 
          prevList.map((item) => 
            // Support cả trường hợp DB trả về ID hoặc Id
            (item.ID === id || item.Id === id) ? { ...item, ...updateData } : item
          )
        );
        alert("Cập nhật thông tin thành công!");
        return true; 
      }
    } catch (err) {
      console.error("Lỗi cập nhật lớp học phần:", err);
      alert("Lỗi khi cập nhật. Vui lòng kiểm tra lại!");
      return false;
    }
  };

  // ==========================================
  // 4. XÓA LỚP HỌC PHẦN
  // ==========================================
  const deleteLopHocPhan = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa lớp học phần này?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/lophocphan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Lọc bỏ phần tử vừa xóa khỏi state (check cả ID và Id)
      setLopHocPhans((prevList) => prevList.filter((item) => (item.ID !== id && item.Id !== id)));
      
      alert("Đã xóa lớp học phần thành công!");
    } catch (err) {
      console.error("Lỗi xóa lớp học phần:", err);
      alert("Lỗi khi xóa lớp học phần. Vui lòng thử lại!");
    }
  };
  const dangKyLopHocPhan = async (sinhVienId, lopHocPhanId) => {
  try {
    // Nhớ thay đổi /api/ketquahoctap thành đúng route gốc bạn khai báo trong server.js nhé
    const res = await axios.post(
      "http://localhost:5001/api/ketquahoctap/dang-ky-mon-hoc", 
      {
        SINHVIEN_ID: sinhVienId,
        LOPHOCPHAN_ID: lopHocPhanId
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      alert(res.data.message || "Thêm sinh viên vào lớp thành công!");
      return true;
    }
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    const msg = err.response?.data?.message || "Lỗi hệ thống khi đăng ký môn học.";
    alert(msg);
    return false;
  }
};

  // Tự động gọi hàm lấy dữ liệu lần đầu khi component được render
  useEffect(() => {
    fetchLopHocPhans();
  }, []);

  return { 
    lopHocPhans, 
    loading, 
    error, 
    refetch: fetchLopHocPhans,
    createLopHocPhan,
    updateLopHocPhan,
    deleteLopHocPhan,
    dangKyLopHocPhan,
    fetchSinhViensByLopHocPhan 
  };
};