USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER PROCEDURE [dbo].[PRO_THEM_LOPHOCPHAN]
    @P_MONHOC_ID UNIQUEIDENTIFIER,
    @P_GIANGVIEN_ID UNIQUEIDENTIFIER = NULL,
    @P_SISO_TOIDA INT = 70,
    @P_TRANGTHAI VARCHAR(20) = 'Mo'
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Tự tạo ID trước để lát nữa Backend lấy cái này đi tìm lại Data
    DECLARE @V_ID UNIQUEIDENTIFIER = NEWID();

    BEGIN TRY
        -- Bắt đầu một giao dịch an toàn
        BEGIN TRANSACTION;

        -- 1. Kiểm tra Môn học có tồn tại không
        IF NOT EXISTS (SELECT 1 FROM [dbo].[MONHOC] WHERE ID = @P_MONHOC_ID AND DAXOA = 0)
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 400 AS StatusCode, N'Lỗi: Môn học không tồn tại hoặc đã bị xoá!' AS Message, NULL AS NewId;
            RETURN;
        END

        -- 2. Thực hiện chèn (Bổ sung cột SISO = 0)
        INSERT INTO [dbo].[LOPHOCPHAN] (
            ID, MALOP, MONHOC_ID, GIANGVIEN_ID, HOCKY, SISO, SISO_TOIDA, TRANGTHAI
        )
        VALUES (
            @V_ID, '', @P_MONHOC_ID, @P_GIANGVIEN_ID, '', 0, @P_SISO_TOIDA, @P_TRANGTHAI
        );

        -- 3. Xác nhận lưu dữ liệu và trả kết quả về Backend
        COMMIT TRANSACTION;
        
        SELECT 200 AS StatusCode, 
               N'Thêm lớp học phần thành công!' AS Message, 
               @V_ID AS NewId;

    END TRY
    BEGIN CATCH
        -- Nếu có lỗi xảy ra, lập tức huỷ bỏ các thay đổi
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SELECT 500 AS StatusCode, 
               ERROR_MESSAGE() AS Message, 
               NULL AS NewId;
    END CATCH
END
GO