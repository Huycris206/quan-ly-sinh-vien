import { createContext, useContext, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// 1. Tạo Context (Đám mây)
const AuthContext = createContext();

// 2. Component Provider (Trạm phát sóng bao bọc toàn bộ ứng dụng)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // Biến này giúp ứng dụng không bị chớp giật (render sai) 
  // trong lúc đang tốn vài mili-giây để đọc dữ liệu từ ổ cứng (localStorage)
  const [isReady, setIsReady] = useState(false);

  // Chạy 1 lần duy nhất khi load trang web để kiểm tra xem đã đăng nhập chưa
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("currentUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    // Đọc xong rồi thì báo sẵn sàng để render giao diện
    setIsReady(true);
  }, []);

  // Hàm xử lý Đăng nhập (Lưu vào State và LocalStorage)
  const login = (newToken, userData) => {
    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  // Hàm xử lý Đăng xuất (Xóa khỏi State và LocalStorage)
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    setToken(null);
    setUser(null);
  };

  // Đóng gói tất cả dữ liệu và hàm muốn chia sẻ vào biến value
  const value = {
    user,             // Chứa thông tin: id, username, role...
    token,            // Chuỗi JWT
    isAuthenticated: !!token, // Sẽ là true nếu có token, false nếu không
    login,
    logout,
  };

  // Nếu chưa đọc xong LocalStorage thì hiện vòng tròn xoay xoay
  if (!isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Nếu xong rồi thì render ứng dụng bình thường
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom Hook (Công cụ để các file khác lấy dữ liệu từ đám mây xuống)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong <AuthProvider>");
  }
  return context;
};