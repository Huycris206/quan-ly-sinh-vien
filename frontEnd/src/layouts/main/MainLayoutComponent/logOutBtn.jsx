
import { LogOut } from "lucide-react";
const LogOutBtn = ({ onLogout }) => {
  

  const handleLogout = () => {
    // 1. Xóa dữ liệu trình duyệt
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // 2. Gọi hàm callback để cập nhật State ở Header
    if (onLogout) onLogout();
    
    // 3. Chuyển hướng

  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-500 hover:underline flex items-center gap-3  px-4 py-3"
    >
      <LogOut size={22}></LogOut>
      <span>Đăng xuất</span>
    </button>
  );
};

export default LogOutBtn;