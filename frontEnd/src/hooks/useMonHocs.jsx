import { useEffect, useState } from "react";
import axios from "axios";

export const useMonHocs = () => {
  const [monHocs, setMonHocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  // 1. LẤY DANH SÁCH MÔN HỌC
  const fetchMonHocs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("http://localhost:5001/api/monhoc", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMonHocs(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy môn học:", err);
      setError("Không thể tải danh sách môn học.");
    } finally {
      setLoading(false);
    }
  };

  // 2. XÓA MÔN HỌC (soft delete)
  const deleteMonHoc = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa môn học này?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/monhoc/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMonHocs((prev) => prev.filter((mh) => mh.ID !== id));
      alert("Đã xóa môn học!");
    } catch (err) {
      console.error("Lỗi xóa môn học:", err);
      alert("Xóa thất bại!");
    }
  };

  // 3. CẬP NHẬT MÔN HỌC
  const updateMonHoc = async (id, updateData) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/monhoc/${id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setMonHocs((prev) =>
          prev.map((mh) =>
            mh.ID === id ? { ...mh, ...updateData } : mh
          )
        );
        alert("Cập nhật môn học thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại!");
      return false;
    }
  };

  // 4. THÊM MỚI MÔN HỌC
  const createMonHoc = async (newData) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/monhoc",
        newData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setMonHocs((prev) => [res.data.data, ...prev]);
        alert("Thêm môn học thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi thêm môn học:", err);
      const msg =
        err.response?.data?.message || "Thêm môn học thất bại!";
      alert(msg);
      return false;
    }
  };

  // 5. LẤY CHI TIẾT 1 MÔN HỌC
  const getMonHocById = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/monhoc/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (err) {
      console.error("Lỗi lấy chi tiết môn học:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchMonHocs();
  }, []);

  return {
    monHocs,
    loading,
    error,
    refetch: fetchMonHocs,
    deleteMonHoc,
    updateMonHoc,
    createMonHoc,
    getMonHocById,
  };
};