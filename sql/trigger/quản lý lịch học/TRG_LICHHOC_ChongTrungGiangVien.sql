USE [QuanLyHoSoSinhVien]
GO
CREATE OR ALTER TRIGGER [dbo].[TRG_LICHHOC_ChongTrungGiangVien]
ON [dbo].[LICHHOC]
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @SoLuongTrung INT;

    -- Kết nối bảng ảo (inserted) với LOPHOCPHAN để biết ai đang dạy lớp này
    -- Sau đó quét đối chiếu với các lịch học của các Lớp khác mà giảng viên đó cũng dạy
    SELECT @SoLuongTrung = COUNT(*)
    FROM inserted i
    INNER JOIN [dbo].[LOPHOCPHAN] lhp_i ON i.LOPHOCPHAN_ID = lhp_i.ID
    INNER JOIN [dbo].[LOPHOCPHAN] lhp_khac ON lhp_i.GIANGVIEN_ID = lhp_khac.GIANGVIEN_ID
    INNER JOIN [dbo].[LICHHOC] lh_khac ON lhp_khac.ID = lh_khac.LOPHOCPHAN_ID
    WHERE 
        i.ID != lh_khac.ID -- Bỏ qua việc tự so sánh với chính lịch vừa thêm
        AND i.THU = lh_khac.THU -- Cùng thứ trong tuần
        AND i.TIET_BATDAU <= lh_khac.TIET_KETTHUC -- Bắt đầu trước khi lớp kia kết thúc
        AND i.TIET_KETTHUC >= lh_khac.TIET_BATDAU -- Kết thúc sau khi lớp kia bắt đầu
        AND lhp_i.GIANGVIEN_ID IS NOT NULL; -- Chỉ xét nếu lớp đã được phân công GV

    IF (@SoLuongTrung > 0)
    BEGIN
        RAISERROR (N'Lỗi: Xếp thời khóa biểu thất bại! Giảng viên phụ trách lớp này đã có lịch dạy trùng giờ.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO