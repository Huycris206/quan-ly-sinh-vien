import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/main/MainLayout";
import AuthLayout from "./layouts/auth/AuthLayout";
import Dashboard from "./pages/Dashboard/Dashboard";

import ManageSinhViens from "./pages/SinhViens/ManageSinhViens.jsx";
import SinhVienDetail from "./pages/SinhViens/SinhVienDetail.jsx";

import ManageGiangViens from "./pages/GiangViens/ManageGiangViens.jsx";
import GiangVienDetail from "./pages/GiangViens/GiangVienDetail.jsx";

import ManageLopHocPhans from "./pages/LopHocPhans/ManageLopHocPhans.jsx";
import LopHocPhanDetail from "./pages/LopHocPhans/LopHocPhanDetail.jsx";

import Login from "./pages/Auth/LoginPage";
import PrivateRoute from "./context/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Luồng Auth: Không cần đăng nhập */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            {/* Có thể thêm /forgot-password, /reset-password ở đây */}
          </Route>
          {/* Luồng Chính: Cần đăng nhập */}
          <Route element={<PrivateRoute />}>

            <Route element={<MainLayout />}>

              <Route path="/" element={<Dashboard />} />

              <Route path="/sinhviens" element={<ManageSinhViens />} />
              <Route path="/sinhviens/:id" element={<SinhVienDetail />} />

              <Route path="/giangviens" element={<ManageGiangViens />} />
              <Route path="/giangviens/:id" element={<GiangVienDetail />} />

              <Route path="/lophocphans" element={<ManageLopHocPhans />} />
              <Route path="/lophocphans/:id" element={<LopHocPhanDetail />} />

            </Route>

          </Route>
        
          

          {/* Catch-all: Nếu gõ link linh tinh thì đẩy về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
