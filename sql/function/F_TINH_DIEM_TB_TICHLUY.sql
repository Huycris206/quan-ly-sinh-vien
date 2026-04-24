USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER FUNCTION [dbo].[F_TINH_DIEM_TB_TICHLUY] 
(
    @P_SINHVIEN_ID UNIQUEIDENTIFIER
)
RETURNS FLOAT
AS
BEGIN
    DECLARE @V_GPA FLOAT = 0;
    DECLARE @V_TONGTINCHI INT = 0;
    DECLARE @V_TONGDIEM FLOAT = 0;

    -- 1. Bảng ảo lọc ra Điểm cao nhất của từng môn (Xử lý trường hợp học lại/cải thiện)
    ;WITH DiemCaoNhat AS (
        SELECT 
            lhp.MONHOC_ID,
            MAX(kq.DIEMTONGKET) AS DIEM_MAX -- Chỉ lấy điểm thi cao nhất của môn đó
        FROM [dbo].[KETQUAHOCTAP] kq
        INNER JOIN [dbo].[LOPHOCPHAN] lhp ON kq.LOPHOCPHAN_ID = lhp.ID
        WHERE 
            kq.SINHVIEN_ID = @P_SINHVIEN_ID 
            AND kq.TRANGTHAI_DANGKY = 'ThanhCong'
            AND kq.DIEMTONGKET IS NOT NULL
        GROUP BY lhp.MONHOC_ID
    )
    -- 2. Tính tổng tín chỉ và tổng điểm dựa trên bảng điểm cao nhất
    SELECT 
        @V_TONGTINCHI = ISNULL(SUM(mh.SOTINCHI), 0), -- Dùng ISNULL chống lỗi NULL
        @V_TONGDIEM = ISNULL(SUM(dcn.DIEM_MAX * mh.SOTINCHI), 0)
    FROM DiemCaoNhat dcn
    INNER JOIN [dbo].[MONHOC] mh ON dcn.MONHOC_ID = mh.ID;

    -- 3. Chia trung bình
    IF (@V_TONGTINCHI > 0)
    BEGIN
        SET @V_GPA = ROUND((@V_TONGDIEM / @V_TONGTINCHI), 2);
    END

    RETURN @V_GPA;
END
GO