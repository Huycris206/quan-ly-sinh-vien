USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER PROCEDURE [dbo].[PRO_THEM_LOPHOCPHAN]
    @P_MONHOC_ID UNIQUEIDENTIFIER,
    @P_GIANGVIEN_ID UNIQUEIDENTIFIER = NULL, -- Có thể chưa sắp giảng viên ngay
    @P_SISO_TOIDA INT = 70,
    @P_TRANGTHAI VARCHAR(20) = 'Mo'
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Tự tạo ID trước để lát nữa Backend lấy cái này đi tìm lại Data
    DECLARE @V_ID UNIQUEIDENTIFIER = NEWID();

    BEGIN TRY
        -- 1. (Tùy chọn) Kiểm tra Môn học có tồn tại không
        IF NOT EXISTS (SELECT 1 FROM [dbo].[MONHOC] WHERE ID = @P_MONHOC_ID AND DAXOA = 0)
        BEGIN
            SELECT 400 AS StatusCode, N'Lỗi: Môn học không tồn tại!' AS Message;
            RETURN;
        END

        -- 2. Thực hiện chèn (Trigger TRG_INS_LHP_TAO_MALOP sẽ tự động bắt lấy lệnh này)
        -- Lưu ý: Phải truyền một chuỗi rỗng '' vào MALOP và HOCKY để không bị lỗi NOT NULL,
        -- sau đó Trigger của bạn sẽ tự động ghi đè lên chuỗi rỗng này bằng công thức xịn của bạn.
        INSERT INTO [dbo].[LOPHOCPHAN] (
            ID, MALOP, MONHOC_ID, GIANGVIEN_ID, HOCKY, SISO_TOIDA, TRANGTHAI
        )
        VALUES (
            @V_ID, '', @P_MONHOC_ID, @P_GIANGVIEN_ID, '', @P_SISO_TOIDA, @P_TRANGTHAI
        );

        -- 3. Trả về thành công kèm theo cái ID vừa tạo
        SELECT 200 AS StatusCode, 
               N'Thêm lớp học phần thành công!' AS Message, 
               @V_ID AS NewId;

    END TRY
    BEGIN CATCH
        SELECT 500 AS StatusCode, ERROR_MESSAGE() AS Message;
    END CATCH
END
GO