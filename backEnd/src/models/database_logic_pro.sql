USE [QuanLyHoSoSinhVien]
GO

-- =============================================
-- 1. VIEW: XEM DANH SÁCH SINH VIÊN ĐẦY ĐỦ THÔNG TIN
-- Giúp Backend không phải JOIN nhiều bảng phức tạp
-- =============================================
CREATE VIEW View_SinhVien_FullInfo AS
SELECT 
    sv.Student_id AS [Mã SV],
    sv.Full_name AS [Họ Tên],
    sv.Gender AS [Giới Tính],
    sv.Birthday AS [Ngày Sinh],
    n.Name AS [Ngành],
    cn.Name AS [Chuyên Ngành],
    sv.TrangThai AS [Trạng Thái Học],
    u.Username AS [Tài Khoản]
FROM [dbo].[SinhVien] sv
JOIN [dbo].[ChuyenNganh] cn ON sv.ChuyenNganhId = cn.Id
JOIN [dbo].[Nganh] n ON cn.NganhId = n.Id
JOIN [dbo].[Users] u ON sv.UserId = u.Id
WHERE sv.IsDeleted = 0;
GO

-- =============================================
-- 2. TRIGGER: TỰ ĐỘNG CẬP NHẬT THỜI GIAN SỬA (UpdatedAt)
-- Áp dụng cho bảng SinhVien để theo dõi vết chỉnh sửa
-- =============================================
CREATE TRIGGER trg_UpdateTimestamp_SinhVien
ON [dbo].[SinhVien]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[SinhVien]
    SET UpdatedAt = GETDATE()
    FROM inserted
    WHERE [dbo].[SinhVien].Id = inserted.Id
END
GO

-- =============================================
-- 3. STORED PROCEDURE: THỐNG KÊ ĐIỂM THEO LỚP
-- Giúp xuất báo cáo nhanh cho từng lớp học phần
-- =============================================
CREATE PROCEDURE sp_ThongKeDiemTheoLop
    @LopHocPhanId uniqueidentifier
AS
BEGIN
    SELECT 
        sv.Student_id,
        sv.Full_name,
        kq.DiemSo,
        CASE 
            WHEN kq.DiemSo >= 4.0 THEN N'Đạt'
            ELSE N'Học lại'
        END AS [Kết Quả]
    FROM [dbo].[KetQuaHocTap] kq
    JOIN [dbo].[SinhVien] sv ON kq.SinhVienId = sv.Id
    WHERE kq.LopHocPhanId = @LopHocPhanId
    ORDER BY kq.DiemSo DESC;
END
GO