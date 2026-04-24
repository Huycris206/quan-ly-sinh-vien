USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER FUNCTION [dbo].[F_KIEMTRA_QUAMON] 
(
    @P_SINHVIEN_ID UNIQUEIDENTIFIER,
    @P_MONHOC_ID UNIQUEIDENTIFIER
)
RETURNS BIT
AS
BEGIN
    DECLARE @V_KETQUA BIT = 0; -- Mặc định là 0 (Chưa qua môn)

    -- Kiểm tra xem có dòng dữ liệu nào thỏa mãn điều kiện điểm >= 4.0 không
    IF EXISTS (
        SELECT 1 
        FROM [dbo].[KETQUAHOCTAP] kq
        INNER JOIN [dbo].[LOPHOCPHAN] lhp ON kq.LOPHOCPHAN_ID = lhp.ID
        WHERE 
            kq.SINHVIEN_ID = @P_SINHVIEN_ID 
            AND lhp.MONHOC_ID = @P_MONHOC_ID
            AND kq.TRANGTHAI_DANGKY = 'ThanhCong'
            AND kq.DIEMTONGKET >= 4.0
    )
    BEGIN
        SET @V_KETQUA = 1; -- Đã qua môn
    END

    RETURN @V_KETQUA;
END
GO