USE [QuanLyHoSoSinhVien]
GO
CREATE OR ALTER TRIGGER [dbo].[TRG_INS_LICH_TRUNGLICH]
ON [dbo].[LICHHOC]
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @SoLuongTrung INT;

    -- Kiểm tra giao nhau về thời gian trong cùng một PHONGHOC và cùng THU
    -- Công thức trùng lịch: Tiết BĐ lớp này <= Tiết KT lớp kia VÀ Tiết KT lớp này >= Tiết BĐ lớp kia
    SELECT @SoLuongTrung = COUNT(*)
    FROM [dbo].[LICHHOC] lh
    INNER JOIN inserted i ON lh.PHONGHOC = i.PHONGHOC AND lh.THU = i.THU AND lh.ID != i.ID
    WHERE i.TIET_BATDAU <= lh.TIET_KETTHUC AND i.TIET_KETTHUC >= lh.TIET_BATDAU;

    IF (@SoLuongTrung > 0)
    BEGIN
        RAISERROR (N'Lỗi: Xếp thời khóa biểu thất bại do phòng học bị trùng lịch!', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO