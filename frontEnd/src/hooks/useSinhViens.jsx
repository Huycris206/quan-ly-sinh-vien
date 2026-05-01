import { useEffect, useState } from "react";
import axios from "axios";

export const useSinhViens = () => {
  const [sinhViens, setSinhViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchSinhViens();
  }, []);

  return { sinhViens, loading, error, refetch: fetchSinhViens };
};