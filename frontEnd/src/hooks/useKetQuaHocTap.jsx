import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5001/api/ketquahoctap";

export const useKetQuaHocTap = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

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

  const fetchDiemSinhVienTrongLop = async (lopHocPhanId, sinhVienId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/chitiet/${lopHocPhanId}/${sinhVienId}`, { headers });
      return response.data.data;
    } catch (err) {
      console.error("Lỗi khi lấy điểm chi tiết:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDiem = async (updateData) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/update-diem`, updateData, { headers });
      if (res.data.success) {
        alert(res.data.message || "Cập nhật điểm thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi cập nhật điểm:", err);
      const errorMessage = err.response?.data?.message || "Lỗi khi cập nhật điểm!";
      alert(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const dangKyMonHoc = async ({ SINHVIEN_ID, LOPHOCPHAN_ID }) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/dang-ky-mon-hoc`, { SINHVIEN_ID, LOPHOCPHAN_ID }, { headers });
      if (res.data.success) {
        alert(res.data.message || "Đăng ký thành công!");
        return true;
      }
    } catch (err) {
      console.error("Lỗi đăng ký môn học:", err);
      const errorMessage = err.response?.data?.message || "Lỗi khi đăng ký học phần!";
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
    dangKyMonHoc,
  };
};