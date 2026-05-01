import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Import các UI component của Shadcn
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

// 1. Định nghĩa Rule Validate bằng Zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // 2. Khởi tạo Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  // 3. Hàm xử lý khi Submit Form
  async function onSubmit(values) {
    setIsLoading(true);
    try {
      // GỌI API THẬT ĐẾN BACKEND
      // Lưu ý: Đổi port 5000 thành port mà server Node.js của bạn đang chạy (ví dụ 8080)
      const response = await axios.post("http://localhost:5001/api/auth/login", values);

      // Trích xuất dữ liệu từ response của Backend
      const { token, user, message } = response.data;

      login(token, user);
      
      // Báo thành công và chuyển hướng về Dashboard
      toast.success(message || "Đăng nhập thành công!");
      navigate("/"); 
      
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      
      // Bắt chính xác câu lỗi gửi từ res.status(401).json({ message: '...' }) của Backend
      const errorMessage = error.response?.data?.message || "Không thể kết nối đến server. Vui lòng thử lại!";
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Tắt hiệu ứng loading
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập tên đăng nhập và mật khẩu của bạn để truy cập hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Trường Tên Đăng Nhập */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên đăng nhập..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trường Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Mật khẩu</FormLabel>
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                      Quên mật khẩu?
                    </a>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nút Submit */}
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
            
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}