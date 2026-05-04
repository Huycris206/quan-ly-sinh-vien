import React from "react";
import { useNavigate } from "react-router-dom";
import { useSinhViens } from "@/hooks/sinhVienHooks/useSinhViens";
import { useGiangViens } from "@/hooks/useGiangViens";
import { useLopHocPhans } from "@/hooks/useLopHocPhans";
import { useMonHocs } from "@/hooks/useMonHocs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { sinhViens = [] } = useSinhViens();
  const { giangViens = [] } = useGiangViens();
  const { lopHocPhans = [] } = useLopHocPhans();
  const { monHocs = [] } = useMonHocs();

  const cards = [
    {
      title: "Sinh Viên",
      count: sinhViens.length,
      desc: "Tổng số sinh viên",
      icon: "🎓",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-600",
      path: "/sinhviens",
    },
    {
      title: "Giảng Viên",
      count: giangViens.length,
      desc: "Tổng số giảng viên",
      icon: "👨‍🏫",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-600",
      path: "/giangviens",
    },
    {
      title: "Lớp Học Phần",
      count: lopHocPhans.length,
      desc: "Tổng số lớp học phần",
      icon: "📚",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-600",
      path: "/lophocphans",
    },
  ];

  return (
    <div className="py-6 px-4 md:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Tổng Quan Hệ Thống</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Thống kê tổng quan các dữ liệu trong hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className={`cursor-pointer rounded-xl border p-6 ${card.color} hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{card.icon}</span>
              <span className={`text-3xl font-bold ${card.textColor}`}>
                {card.count}
              </span>
            </div>
            <h3 className="font-semibold text-foreground">{card.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;