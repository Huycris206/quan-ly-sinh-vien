USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER PROCEDURE [dbo].[PRO_DANGKY_HOCPHAN]
    @P_SINHVIEN_ID UNIQUEIDENTIFIER,
    @P_LOPHOCPHAN_ID UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- 1. Kiểm tra xem sinh viên đã đăng ký lớp này (mà chưa hủy) hay chưa?
        -- Tránh tình trạng sinh viên spam click nút Đăng ký nhiều lần.
        IF EXISTS (
            SELECT 1 FROM [dbo].[KETQUAHOCTAP] 
            WHERE SINHVIEN_ID = @P_SINHVIEN_ID 
              AND LOPHOCPHAN_ID = @P_LOPHOCPHAN_ID 
              AND TRANGTHAI_DANGKY IN ('ThanhCong', 'ChoDuyet')
        )
        BEGIN
            SELECT 400 AS StatusCode, N'Lỗi: Bạn đã đăng ký lớp học phần này rồi!' AS Message;
            RETURN;
        END

        -- 2. Thực hiện lệnh INSERT
        -- Ngay khi lệnh này chạy, Trigger TRG_INS_DKHP_KIEMTRA sẽ tự động đánh thức.
        -- Trigger sẽ quét Sĩ số, Môn tiên quyết, Trùng lịch... 
        -- Nếu vượt qua hết, dữ liệu sẽ được lưu. Nếu rớt 1 điều kiện, Trigger sẽ bắn lỗi xuống khối CATCH.
        INSERT INTO [dbo].[KETQUAHOCTAP] (SINHVIEN_ID, LOPHOCPHAN_ID, TRANGTHAI_DANGKY)
        VALUES (@P_SINHVIEN_ID, @P_LOPHOCPHAN_ID, 'ThanhCong');

        -- 3. Trả về thành công nếu lệnh INSERT lọt qua được cửa ải của Trigger
        SELECT 200 AS StatusCode, N'Đăng ký học phần thành công!' AS Message;
    END TRY
    BEGIN CATCH
        -- Bắt toàn bộ thông báo lỗi do Trigger RAISERROR ném ra (VD: "Lớp đã đầy", "Chưa qua môn tiên quyết"...)
        SELECT 400 AS StatusCode, ERROR_MESSAGE() AS Message;
    END CATCH
END
GO