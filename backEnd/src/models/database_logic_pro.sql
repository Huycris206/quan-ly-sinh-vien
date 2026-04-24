USE [QuanLyHoSoSinhVien]
GO

-- =============================================
-- 1. VIEW: XEM DANH SÁCH SINH VIÊN ĐẦY ĐỦ THÔNG TIN
-- =============================================
IF OBJECT_ID('View_SinhVien_FullInfo', 'V') IS NOT NULL DROP VIEW View_SinhVien_FullInfo;
GO

CREATE VIEW View_SinhVien_FullInfo AS
SELECT 
    sv.Student_id AS [Mã SV],
    sv.Full_name AS [Họ Tên],
    sv.Gender AS [Giới Tính],
    sv.Birthday AS [Ngày Sinh],
    n.Name AS [Ngành],
    cn.Name AS [Chuyên Ngành],
    sv.TRANGTHAI AS [Trạng Thái Học], 
    u.Username AS [Tài Khoản]
FROM [dbo].[SinhVien] sv
JOIN [dbo].[ChuyenNganh] cn ON sv.ChuyenNganhId = cn.Id
JOIN [dbo].[Nganh] n ON cn.NganhId = n.Id
JOIN [dbo].[Users] u ON sv.UserId = u.Id
WHERE sv.IsDeleted = 0;
GO

-- =============================================
-- 2. TRIGGER: TỰ ĐỘNG CẬP NHẬT THỜI GIAN SỬA (UpdatedAt)
-- =============================================
IF OBJECT_ID('trg_UpdateTimestamp_SinhVien', 'TR') IS NOT NULL DROP TRIGGER trg_UpdateTimestamp_SinhVien;
GO

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
-- =============================================
IF OBJECT_ID('sp_ThongKeDiemTheoLop', 'P') IS NOT NULL DROP PROCEDURE sp_ThongKeDiemTheoLop;
GO

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

-- =============================================
-- 4. VIEW: DANH SÁCH LỚP HỌC PHẦN CHI TIẾT
-- =============================================
IF OBJECT_ID('View_LopHocPhan_ChiTiet', 'V') IS NOT NULL DROP VIEW View_LopHocPhan_ChiTiet;
GO

CREATE VIEW View_LopHocPhan_ChiTiet AS
SELECT 
    lhp.MALOP AS [Mã Lớp],
    mh.Name AS [Tên Môn Học],
    gv.Full_name AS [Giảng Viên],
    lhp.HOCKY AS [Học Kỳ],
    lhp.SISO_TOIDA AS [Sĩ Số Tối Đa],
    lhp.TRANGTHAI AS [Trạng Thái Lớp]
FROM [dbo].[LopHocPhan] lhp
LEFT JOIN [dbo].[MonHoc] mh ON lhp.MonHocId = mh.Id
LEFT JOIN [dbo].[GiangVien] gv ON lhp.Teacher_id = gv.Id
WHERE lhp.DAXOA = 0; 
GO