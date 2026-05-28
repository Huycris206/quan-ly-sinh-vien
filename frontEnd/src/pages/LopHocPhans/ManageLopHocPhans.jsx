import React, { useState } from "react";
import { useLopHocPhans } from "../../hooks/useLopHocPhans";
import { useGiangViens } from "../../hooks/useGiangViens"; // 1. IMPORT HOOK GV
import { useMonHocs } from "../../hooks/useMonHocs";
import Loadingcomp from "@/components/ui/Loading.jsx"; 

import ManageHeader from "./ManageHeader";
import LopHocPhanTable from "./LopHocPhanTable";
import LopHocPhanModal from "./LopHocPhanModal";

const ManageLopHoc = () => {
  const { lopHocPhans, loading, error, refetch, deleteLopHocPhan, updateLopHocPhan, createLopHocPhan } = useLopHocPhans();
  
  const { giangViens } = useGiangViens();
  const { monHocs } = useMonHocs();

  const [isAddingMode, setIsAddingMode] = useState(false);
  const [editingClass, setEditingClass] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 

  // =================== XỬ LÝ LỌC TÌM KIẾM ===================
  const filteredClasses = lopHocPhans.filter((lop) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lop.MALOP?.toLowerCase().includes(searchLower) ||
      lop.MonHoc?.TENMONHOC?.toLowerCase().includes(searchLower) ||
      lop.GiangVien?.HOTEN?.toLowerCase().includes(searchLower) ||
      lop.HOCKY?.toLowerCase().includes(searchLower)
    );
  });

  // =================== XỬ LÝ SUBMIT FORM ===================
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newClassData = Object.fromEntries(formData.entries());
    const isSuccess = await createLopHocPhan(newClassData);
    if (isSuccess) setIsAddingMode(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());
    
    const classId = editingClass.ID || editingClass.Id; 
    const isSuccess = await updateLopHocPhan(classId, updatedData);
    
    if (isSuccess) setEditingClass(null);
  };

  const handleCloseModal = () => {
    setIsAddingMode(false);
    setEditingClass(null);
  };

  // =================== RENDER TRẠNG THÁI ===================
  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><Loadingcomp caigi="dữ liệu lớp học phần" /></div>;
  if (error) return (
      <div className="text-center p-10 bg-destructive/10 rounded-xl border border-destructive/20 mt-8">
        <p className="text-destructive font-medium">{error}</p>
        <button onClick={refetch} className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 text-sm font-medium">Tải lại</button>
      </div>
  );

  // =================== RENDER GIAO DIỆN CHÍNH ===================
  return (
    <div className="py-6 px-4 md:px-8">
      
      {/* 1. HEADER */}
      <ManageHeader 
        totalCount={lopHocPhans.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => setIsAddingMode(true)}
      />

      {/* 2. TABLE DANH SÁCH */}
      <LopHocPhanTable 
        classes={filteredClasses}
        searchTerm={searchTerm}
        onEdit={setEditingClass}
        onDelete={deleteLopHocPhan}
      />

      {/* 3. MODAL FORM */}
      <LopHocPhanModal 
        isAddingMode={isAddingMode}
        editingClass={editingClass}
        onClose={handleCloseModal}
        onAddSubmit={handleAddSubmit}
        onEditSubmit={handleEditSubmit}
        giangViens={giangViens || []} // Truyền mảng GV
        monHocs={monHocs || []}       // Truyền mảng Môn Học
      />
    </div>
  );
};

export default ManageLopHoc;