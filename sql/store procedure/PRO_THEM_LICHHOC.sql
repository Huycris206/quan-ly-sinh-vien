USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER PROCEDURE [dbo].[PRO_THEM_LICHHOC]
    @P_LOPHOCPHAN_ID UNIQUEIDENTIFIER,
    @P_THU INT,
    @P_TIET_BATDAU INT,
    @P_TIET_KETTHUC INT,
    @P_PHONGHOC VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- 1. Kiểm tra tính hợp lệ của dữ liệu đầu vào
        IF @P_THU < 2 OR @P_THU > 8
        BEGIN
            SELECT 400 AS StatusCode, N'Lỗi: Thứ không hợp lệ (Phải từ 2 đến 8)!' AS Message;
            RETURN;
        END

        IF @P_TIET_BATDAU > @P_TIET_KETTHUC OR @P_TIET_BATDAU < 1 OR @P_TIET_KETTHUC > 12
        BEGIN
            SELECT 400 AS StatusCode, N'Lỗi: Tiết học không hợp lệ (Từ 1 đến 12)!' AS Message;
            RETURN;
        END

        -- 2. Kiểm tra trùng lịch phòng học
        -- Logic: Nếu (Bắt đầu mới <= Kết thúc cũ) VÀ (Kết thúc mới >= Bắt đầu cũ) thì là trùng.
        IF EXISTS (
            SELECT 1 FROM [dbo].[LICHHOC]
            WHERE PHONGHOC = @P_PHONGHOC 
              AND THU = @P_THU
              AND (@P_TIET_BATDAU <= TIET_KETTHUC AND @P_TIET_KETTHUC >= TIET_BATDAU)
        )
        BEGIN
            SELECT 400 AS StatusCode, N'Lỗi: Phòng học này đã có lịch vào thời gian trên!' AS Message;
            RETURN;
        END

        -- 3. Thêm lịch học
        INSERT INTO [dbo].[LICHHOC] (ID, LOPHOCPHAN_ID, THU, TIET_BATDAU, TIET_KETTHUC, PHONGHOC)
        VALUES (NEWID(), @P_LOPHOCPHAN_ID, @P_THU, @P_TIET_BATDAU, @P_TIET_KETTHUC, @P_PHONGHOC);

        SELECT 200 AS StatusCode, N'Thêm lịch học thành công!' AS Message;

    END TRY
    BEGIN CATCH
        SELECT 500 AS StatusCode, ERROR_MESSAGE() AS Message;
    END CATCH
END
GO