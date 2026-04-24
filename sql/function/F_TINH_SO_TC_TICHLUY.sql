USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER FUNCTION [dbo].[F_TINH_SO_TC_TICHLUY] 
(
    @P_SINHVIEN_ID UNIQUEIDENTIFIER
)
RETURNS INT
AS
BEGIN
    DECLARE @V_TONGTINCHI INT = 0;

    -- 1. Bảng ảo lọc ra những Môn học mà sinh viên ĐÃ THI ĐẠT
    -- Dùng HAVING MAX() >= 4.0 để đảm bảo: Dù học lại bao nhiêu lần, 
    -- chỉ cần có 1 lần điểm >= 4.0 là tính đã qua môn, và chỉ lấy ra mã môn 1 lần duy nhất.
    ;WITH CacMonDaQua AS (
        SELECT 
            lhp.MONHOC_ID
        FROM [dbo].[KETQUAHOCTAP] kq
        INNER JOIN [dbo].[LOPHOCPHAN] lhp ON kq.LOPHOCPHAN_ID = lhp.ID
        WHERE 
            kq.SINHVIEN_ID = @P_SINHVIEN_ID 
            AND kq.TRANGTHAI_DANGKY = 'ThanhCong'
            AND kq.DIEMTONGKET IS NOT NULL
        GROUP BY lhp.MONHOC_ID
        HAVING MAX(kq.DIEMTONGKET) >= 4.0 
    )
    
    -- 2. Tính tổng số tín chỉ từ danh sách các môn đã qua ở bảng ảo
    SELECT 
        -- Dùng ISNULL để nếu sinh viên chưa qua môn nào, kết quả trả về 0 thay vì NULL
        @V_TONGTINCHI = ISNULL(SUM(mh.SOTINCHI), 0)
    FROM CacMonDaQua cm
    INNER JOIN [dbo].[MONHOC] mh ON cm.MONHOC_ID = mh.ID;

    RETURN @V_TONGTINCHI;
END
GO