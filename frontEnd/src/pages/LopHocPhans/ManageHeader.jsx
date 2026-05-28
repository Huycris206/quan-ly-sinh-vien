import React from "react";
import { Search } from "lucide-react";

const ManageHeader = ({ totalCount, searchTerm, setSearchTerm, onAddClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Quản Lý Lớp Học Phần</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Hệ thống đang quản lý tổng cộng {totalCount} lớp học phần
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo Mã lớp, Tên môn, GV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <button 
          onClick={onAddClick}
          className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
        >
          + Mở lớp mới
        </button>
      </div>
    </div>
  );
};

export default ManageHeader;