import React, { useState } from "react";
import { User, Lock, Bell, Palette, Save } from "lucide-react";
import { toast } from "sonner";

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
        <Icon className="w-4 h-4 text-violet-600" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div className="space-y-1.5 mb-4">
    <label className="text-sm font-medium text-foreground">{label}</label>
    {children}
  </div>
);

const inputCls = "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400";

const CaiDat = () => {
  const [theme, setTheme] = useState("light");
  const [notif, setNotif] = useState({ email: true, system: true });

  const handleSave = () => toast.success("Đã lưu cài đặt!");

  return (
    <div className="py-8 px-4 md:px-10 min-h-screen bg-gray-50/50">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Cài Đặt</h2>
        <p className="text-muted-foreground mt-1 text-sm">Quản lý tài khoản và tuỳ chỉnh hệ thống</p>
      </div>

      <div className="max-w-2xl">

        {/* Thông tin cá nhân */}
        <Section icon={User} title="Thông tin tài khoản">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Họ và tên">
              <input className={inputCls} defaultValue="Admin" placeholder="Họ và tên" />
            </Field>
            <Field label="Email">
              <input className={inputCls} defaultValue="admin@school.edu.vn" placeholder="Email" />
            </Field>
            <Field label="Số điện thoại">
              <input className={inputCls} placeholder="090..." />
            </Field>
            <Field label="Vai trò">
              <input className={inputCls} defaultValue="Quản trị viên" disabled />
            </Field>
          </div>
        </Section>

        {/* Đổi mật khẩu */}
        <Section icon={Lock} title="Đổi mật khẩu">
          <Field label="Mật khẩu hiện tại">
            <input type="password" className={inputCls} placeholder="••••••••" />
          </Field>
          <Field label="Mật khẩu mới">
            <input type="password" className={inputCls} placeholder="••••••••" />
          </Field>
          <Field label="Xác nhận mật khẩu mới">
            <input type="password" className={inputCls} placeholder="••••••••" />
          </Field>
        </Section>

        {/* Thông báo */}
        <Section icon={Bell} title="Thông báo">
          {[
            { key: "email", label: "Thông báo qua Email", desc: "Nhận thông báo khi có cập nhật mới" },
            { key: "system", label: "Thông báo hệ thống", desc: "Hiển thị thông báo trong ứng dụng" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotif((p) => ({ ...p, [item.key]: !p[item.key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notif[item.key] ? "bg-violet-600" : "bg-slate-200"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${notif[item.key] ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </Section>

        {/* Giao diện */}
        <Section icon={Palette} title="Giao diện">
          <div className="flex gap-3">
            {["light", "dark", "system"].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  theme === t
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white text-muted-foreground border-slate-200 hover:border-violet-300"
                }`}
              >
                {t === "light" ? "Sáng" : t === "dark" ? "Tối" : "Hệ thống"}
              </button>
            ))}
          </div>
        </Section>

        {/* Lưu */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Lưu cài đặt
        </button>

      </div>
    </div>
  );
};

export default CaiDat;