import React from "react";
import Loadingcomp from "@/components/ui/Loading.jsx"; 
import SinhVienTable from "./component/SinhVienTable";
import ManageHeader from "./component/ManageHeader";
import SinhVienModal from "./component/SinhVienModal";

// Import Custom Hook
import { useSinhVienLogic } from "@/hooks/sinhVienHooks/useSinhVienLogics"; 
// 1. IMPORT HOOK LẤY DANH SÁCH CHUYÊN NGÀNH
import { useChuyenNganhs } from "@/hooks/useChuyenNganhs"; // Đổi lại đường dẫn nếu cần

const ManageSinhVien = () => {
  const logic = useSinhVienLogic();
  
  // 2. GỌI HOOK LẤY DATA CHUYÊN NGÀNH
  const { chuyenNganhs } = useChuyenNganhs();

  // =================== RENDER TRẠNG THÁI ===================
  if (logic.loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loadingcomp caigi="dữ liệu sinh viên" />
      </div>
    );
  }

  if (logic.error) {
    return (
      <div className="text-center p-10 bg-destructive/10 rounded-xl border border-destructive/20 mt-8">
        <p className="text-destructive font-medium">{logic.error}</p>
        <button 
          onClick={logic.refetch} 
          className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 text-sm font-medium"
        >
          Tải lại
        </button>
      </div>
    );
  }

  // =================== RENDER GIAO DIỆN CHÍNH ===================
  return (
    <div className="py-6 px-4 md:px-8">
      
      {/* 1. HEADER & THANH TÌM KIẾM */}
      <ManageHeader 
        studentCount={logic.sinhViens.length}
        searchTerm={logic.searchTerm}
        setSearchTerm={logic.setSearchTerm}
        onAddClick={() => logic.setIsAddingMode(true)}
      />

      {/* 2. TABLE DANH SÁCH */}
      <SinhVienTable
        sinhViens={logic.filteredSinhViens}
        onEdit={logic.setEditingStudent}
        onDelete={logic.deleteSinhVien}
      />

      {/* 3. MODAL FORM THÊM / SỬA */}
      <SinhVienModal 
        isAddingMode={logic.isAddingMode}
        editingStudent={logic.editingStudent}
        onClose={logic.handleCloseModal}
        onAddSubmit={logic.handleAddSubmit}
        onEditSubmit={logic.handleEditSubmit}
        chuyenNganhs={chuyenNganhs || []} // 3. TRUYỀN DATA XUỐNG MODAL
      />
      
    </div>
  );
};

export default ManageSinhVien;