import { useState } from "react";
import { useSinhViens } from "./useSinhViens";

export const useSinhVienLogic = () => {
  // 1. Gọi API Hook để lấy dữ liệu và các hàm thao tác với Server
  const { 
    sinhViens, 
    loading, 
    error, 
    refetch, 
    deleteSinhVien, 
    updateSinhVien, 
    createSinhVien 
  } = useSinhViens();

  // 2. Khai báo các State quản lý giao diện (UI State)
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Logic xử lý Lọc/Tìm kiếm
  const filteredSinhViens = (sinhViens || []).filter((sv) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sv.HOTEN?.toLowerCase().includes(searchLower) ||
      sv.MASV?.toLowerCase().includes(searchLower) ||
      sv.SDT?.includes(searchLower)
    );
  });

  // 4. Logic xử lý Form Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStudentData = Object.fromEntries(formData.entries());
    const isSuccess = await createSinhVien(newStudentData);
    
    // Nếu thêm thành công thì đóng Form
    if (isSuccess) setIsAddingMode(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());
    const isSuccess = await updateSinhVien(editingStudent.ID, updatedData);
    
    // Nếu sửa thành công thì đóng Form
    if (isSuccess) setEditingStudent(null);
    refetch();
     // Tải lại dữ liệu mới nhất sau khi cập nhật
  };

  const handleCloseModal = () => {
    setIsAddingMode(false);
    setEditingStudent(null);
  };

  // 5. Trả về tất cả những gì Giao diện (UI) cần dùng
  return {
    // Trạng thái và dữ liệu
    loading,
    error,
    sinhViens,
    filteredSinhViens,
    isAddingMode,
    editingStudent,
    searchTerm,
    
    // Các hàm set state cơ bản
    setSearchTerm,
    setIsAddingMode,
    setEditingStudent,
    
    // Các hàm xử lý sự kiện & API
    refetch,
    deleteSinhVien,
    handleAddSubmit,
    handleEditSubmit,
    handleCloseModal
  };
};