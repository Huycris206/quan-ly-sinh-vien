import { useState } from "react";
import { NavLink, Outlet,Link } from "react-router-dom";
import { Toaster } from "sonner";
import { 
  LayoutDashboard, 
  Users, 
  UserRoundPen,
  GraduationCap, 
  Settings,  
  Menu, 
  X, 
  Bell
} from "lucide-react";
import { cn } from "../../lib/utils"; // Import hàm utils ở trên
import { useAuth } from "../../context/AuthContext"; // Import AuthContext để xử lý đăng xuất
import LogOutBtn from "./MainLayoutComponent/logOutBtn"; // Component nút đăng xuất riêng biệt

// Danh sách menu điều hướng
const NAV_ITEMS = [
  { title: "Tổng quan", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
  { title: "Giảng viên", path: "/giangviens", icon: <UserRoundPen className="w-5 h-5" /> },
  { title: "Sinh viên", path: "/sinhviens", icon: <Users className="w-5 h-5" /> },
  { title: "Lớp học", path: "/lophocphans", icon: <GraduationCap className="w-5 h-5" /> },
  { title: "Cài đặt", path: "/settings", icon: <Settings className="w-5 h-5" /> },
];  

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth(); // Lấy hàm logout từ AuthContext


  return (
    <div className="flex h-screen w-full bg-muted/40 font-geist">
      {/* 1. SIDEBAR (Desktop) */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <Link to='/'>
          <div className="flex h-16 items-center border-b px-6" >
            <GraduationCap className="mr-2 h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              Student Manager
            </span>
          </div>
        </Link>

        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {item.icon}
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t p-4">
          <LogOutBtn onLogout={logout} />
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-2 rounded-md p-2 text-muted-foreground hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-bold">Student Manager</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"></span>
            </button>
            {/* Vùng Profile/Avatar (Có thể thay bằng DropdownMenu của Shadcn) */}
            <div className="h-8 w-8 rounded-full bg-primary/20 border flex items-center justify-center font-semibold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          {/* <Outlet /> là nơi các Component con (StudentList, Dashboard...) sẽ được render */}
          <Outlet />
        </main>
      </div>

      {/* 3. SIDEBAR (Mobile) - Overlay & Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative flex w-64 flex-col bg-background shadow-lg animate-in slide-in-from-left-0">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <span className="text-lg font-bold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="grid gap-2 p-4">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  {item.icon}
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* 4. TOASTER - Component hiển thị thông báo góc màn hình */}
      <Toaster richColors position="top-right" />
    </div>
  );
}