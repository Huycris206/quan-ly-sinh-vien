USE [QuanLyHoSoSinhVien]

GO

-- Trigger tự động tạo mã Sinh viên
CREATE OR ALTER TRIGGER [dbo].[TRG_INS_SV_TAO_MASV]
ON [dbo].[SINHVIEN]
INSTEAD OF INSERT 
AS
BEGIN
    -- Chèn dữ liệu thực tế vào bảng, tự động thay thế cột MASV bằng mã sinh tự động
    INSERT INTO [dbo].[SINHVIEN] (
        [ID], [TAIKHOAN_ID], [MASV], [HOTEN], [GIOITINH], [NGAYSINH], 
        [SDT], [EMAIL], [CCCD], [QUEQUAN], [DIACHI], [KHOAHOC], 
        [CHUYENNGANH_ID], [TRANGTHAI]
    )
    SELECT 
        ISNULL(ID, NEWID()), 
        TAIKHOAN_ID, 
        -- Công thức tạo mã: 'SV' + CCCD
        'SV' + CCCD,
        HOTEN, GIOITINH, NGAYSINH, SDT, EMAIL, CCCD, QUEQUAN, DIACHI, 
        YEAR(GETDATE()), 
        CHUYENNGANH_ID, TRANGTHAI
    FROM inserted;
END
GO