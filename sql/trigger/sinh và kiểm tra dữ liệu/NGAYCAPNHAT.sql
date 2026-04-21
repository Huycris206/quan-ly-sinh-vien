USE [QuanLyHoSoSinhVien]
GO

-- =========================================================================================
-- PHẦN 1: TRIGGER TỰ ĐỘNG CẬP NHẬT THỜI GIAN (AFTER UPDATE)
-- Tự động gán NGAYCAPNHAT = GETDATE() khi có lệnh UPDATE chạy trên bảng
-- =========================================================================================

-- 1. Bảng TAIKHOAN
CREATE OR ALTER TRIGGER [dbo].[TRG_UPD_TAIKHOAN_NgayCapNhat]
ON [dbo].[TAIKHOAN]
AFTER UPDATE
AS
BEGIN
    UPDATE t
    SET NGAYCAPNHAT = GETDATE()
    FROM [dbo].[TAIKHOAN] t
    INNER JOIN inserted i ON t.ID = i.ID;
END
GO

-- 2. Bảng SINHVIEN
CREATE OR ALTER TRIGGER [dbo].[TRG_UPD_SINHVIEN_NgayCapNhat]
ON [dbo].[SINHVIEN]
AFTER UPDATE
AS
BEGIN
    UPDATE t
    SET NGAYCAPNHAT = GETDATE()
    FROM [dbo].[SINHVIEN] t
    INNER JOIN inserted i ON t.ID = i.ID;
END
GO

-- 3. Bảng GIANGVIEN
CREATE OR ALTER TRIGGER [dbo].[TRG_UPD_GIANGVIEN_NgayCapNhat]
ON [dbo].[GIANGVIEN]
AFTER UPDATE
AS
BEGIN
    UPDATE t
    SET NGAYCAPNHAT = GETDATE()
    FROM [dbo].[GIANGVIEN] t
    INNER JOIN inserted i ON t.ID = i.ID;
END
GO


-- =========================================================================================
-- PHẦN 2: TRIGGER XÓA MỀM - SOFT DELETE (INSTEAD OF DELETE)
-- Thay vì xóa mất dữ liệu, chuyển cờ DAXOA = 1 để giữ lại lịch sử đối soát
-- =========================================================================================

-- 1. Bảng NGANH
CREATE OR ALTER TRIGGER [dbo].[TRG_DEL_NGANH_SoftDelete]
ON [dbo].[NGANH]
INSTEAD OF DELETE
AS
BEGIN
    -- Chuyển DAXOA = 1 và cập nhật luôn ngày giờ thay đổi
    UPDATE t
    SET DAXOA = 1, NGAYCAPNHAT = GETDATE()
    FROM [dbo].[NGANH] t
    INNER JOIN deleted d ON t.ID = d.ID;
END
GO

-- 2. Bảng CHUYENNGANH
CREATE OR ALTER TRIGGER [dbo].[TRG_DEL_CHUYENNGANH_SoftDelete]
ON [dbo].[CHUYENNGANH]
INSTEAD OF DELETE
AS
BEGIN
    UPDATE t
    SET DAXOA = 1, NGAYCAPNHAT = GETDATE()
    FROM [dbo].[CHUYENNGANH] t
    INNER JOIN deleted d ON t.ID = d.ID;
END
GO

-- 3. Bảng MONHOC
CREATE OR ALTER TRIGGER [dbo].[TRG_DEL_MONHOC_SoftDelete]
ON [dbo].[MONHOC]
INSTEAD OF DELETE
AS
BEGIN
    UPDATE t
    SET DAXOA = 1, NGAYCAPNHAT = GETDATE()
    FROM [dbo].[MONHOC] t
    INNER JOIN deleted d ON t.ID = d.ID;
END
GO