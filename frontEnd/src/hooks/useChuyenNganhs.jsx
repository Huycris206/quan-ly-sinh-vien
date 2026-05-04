import { useEffect, useState } from "react";
import axios from "axios";

export const useChuyenNganhs = () => {
  const [chuyenNganhs, setChuyenNganhs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  // 1. LẤY DANH SÁCH CHUYÊN NGÀNH
  const fetchChuyenNganhs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("http://localhost:5001/api/chuyennganh", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // IN RA CONSOLE ĐỂ XEM BACKEND TRẢ VỀ CÁI GÌ
      console.log("=== API CHUYÊN NGÀNH TRẢ VỀ ===", res.data);

      // CODE PHÒNG HỜ: Nếu res.data.data không có, thì lấy res.data. 
      // Nếu không có cả 2 thì trả về mảng rỗng [] để không bị lỗi màn hình.
      const dataToSet = res.data.data || res.data || [];
      setChuyenNganhs(dataToSet);
      
    } catch (err) {
      console.error("Lỗi khi lấy chuyên ngành:", err);
      setError("Không thể tải danh sách chuyên ngành.");
    } finally {
      setLoading(false);
    }
  };

  // 2. XÓA CHUYÊN NGÀNH (soft delete)
  const deleteChuyenNganh = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa chuyên ngành này?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/chuyennganh/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChuyenNganhs((prev) => prev.filter((cn) => cn.ID !== id));
      alert("Đã xóa chuyên ngành!");
    } catch (err) {
      console.error("Lỗi xóa chuyên ngành:", err);
      alert("Xóa thất bại!");
    }
  };

  // 3. CẬP NHẬT CHUYÊN NGÀNH
  const updateChuyenNganh = async (id, updateData) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/chuyennganh/${id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setChuyenNganhs((prev) =>
          prev.map((cn) =>
            cn.ID === id ? { ...cn, ...updateData } : cn
          )
        );
        alert("Cập nhật chuyên ngành thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại!");
      return false;
    }
  };

  // 4. THÊM MỚI CHUYÊN NGÀNH
  const createChuyenNganh = async (newData) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/chuyennganh",
        newData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setChuyenNganhs((prev) => [res.data.data, ...prev]);
        alert("Thêm chuyên ngành thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi thêm chuyên ngành:", err);
      const msg =
        err.response?.data?.message || "Thêm chuyên ngành thất bại!";
      alert(msg);
      return false;
    }
  };

  // 5. LẤY CHI TIẾT 1 CHUYÊN NGÀNH
  const getChuyenNganhById = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/chuyennganh/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (err) {
      console.error("Lỗi lấy chi tiết:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchChuyenNganhs();
  }, []);

  return {
    chuyenNganhs,
    loading,
    error,
    refetch: fetchChuyenNganhs,
    deleteChuyenNganh,
    updateChuyenNganh,
    createChuyenNganh,
    getChuyenNganhById,
  };
};