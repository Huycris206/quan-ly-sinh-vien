USE [QuanLyHoSoSinhVien]
GO
CREATE OR ALTER TRIGGER [dbo].[TRG_LOPHOCPHAN_ChongTrungGiangVien]
ON [dbo].[LOPHOCPHAN]
AFTER UPDATE
AS
BEGIN
    -- Chỉ chạy Trigger nếu cột được update là GIANGVIEN_ID
    IF UPDATE(GIANGVIEN_ID)
    BEGIN
        DECLARE @SoLuongTrung INT;

        SELECT @SoLuongTrung = COUNT(*)
        FROM inserted i
        INNER JOIN [dbo].[LICHHOC] lh_i ON i.ID = lh_i.LOPHOCPHAN_ID
        INNER JOIN [dbo].[LOPHOCPHAN] lhp_khac ON i.GIANGVIEN_ID = lhp_khac.GIANGVIEN_ID
        INNER JOIN [dbo].[LICHHOC] lh_khac ON lhp_khac.ID = lh_khac.LOPHOCPHAN_ID
        WHERE 
            i.ID != lhp_khac.ID -- Khác lớp
            AND lh_i.THU = lh_khac.THU -- Cùng thứ
            AND lh_i.TIET_BATDAU <= lh_khac.TIET_KETTHUC 
            AND lh_i.TIET_KETTHUC >= lh_i.TIET_BATDAU
            AND i.GIANGVIEN_ID IS NOT NULL;

        IF (@SoLuongTrung > 0)
        BEGIN
            RAISERROR (N'Lỗi: Phân công thất bại! Giảng viên này đang vướng lịch dạy lớp khác vào cùng khung giờ.', 16, 1);
            ROLLBACK TRANSACTION;
        END
    END
END
GO