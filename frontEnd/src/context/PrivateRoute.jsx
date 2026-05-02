import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  // Lấy trạng thái đăng nhập từ "đám mây" AuthContext
  const { isAuthenticated } = useAuth();

  // Nếu chưa đăng nhập (không có token), đá thẳng về trang /login
  // Thuộc tính replace={true} giúp xóa lịch sử trang hiện tại, 
  // để người dùng không thể bấm nút "Back" của trình duyệt để quay lại trang cấm.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, mở cửa cho phép đi tiếp vào các trang bên trong (Outlet)
  return <Outlet />;
}