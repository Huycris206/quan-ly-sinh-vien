import { Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Toaster } from "sonner";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex bg-muted/40 font-geist">
      
      {/* 1. Phần Background / Banner bên trái (Chỉ hiện trên Desktop) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8" />
          <span className="text-2xl font-bold tracking-tight">Student Manager</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight">
            Quản lý hồ sơ sinh viên <br /> hiệu quả và bảo mật.
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Hệ thống quản lý thông tin, kết quả học tập và tài liệu dành cho cán bộ giảng viên.
          </p>
        </div>
        
        <div className="text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} Student Manager. All rights reserved.
        </div>
      </div>

      {/* 2. Phần Form ở bên phải (Nằm giữa trên Mobile) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          
          {/* Logo cho Mobile (Vì banner trái bị ẩn) */}
          <div className="flex lg:hidden flex-col items-center gap-2 mb-8 text-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Student Manager</span>
          </div>

          {/* Vùng chứa các form (Login, Forgot Password...) */}
          <div className="bg-card p-6 rounded-xl shadow-sm border">
            <Outlet />
          </div>

        </div>
      </div>

      {/* Toaster cho AuthLayout để hứng các lỗi như "Sai mật khẩu" */}
      <Toaster richColors position="top-center" />
    </div>
  );
}