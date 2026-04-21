USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER PROCEDURE [dbo].[PRO_NHAP_DIEM]
    @P_SINHVIEN_ID UNIQUEIDENTIFIER,
    @P_LOPHOCPHAN_ID UNIQUEIDENTIFIER,
    @P_DIEM_CC FLOAT,
    @P_DIEM_GK FLOAT,
    @P_DIEM_CK FLOAT
AS
BEGIN
    BEGIN TRY
        -- Kiểm tra xem sinh viên có tồn tại trong lớp này và không bị hủy môn không
        IF EXISTS (SELECT 1 FROM [dbo].[KETQUAHOCTAP] 
                   WHERE SINHVIEN_ID = @P_SINHVIEN_ID 
                   AND LOPHOCPHAN_ID = @P_LOPHOCPHAN_ID 
                   AND TRANGTHAI_DANGKY = 'ThanhCong')
        BEGIN
            -- Thực hiện cập nhật điểm. 
            -- Ngay khi lệnh này chạy, Trigger TRG_UPD_DIEM_TUDONG sẽ tự động được kích hoạt để tính Điểm tổng kết.
            UPDATE [dbo].[KETQUAHOCTAP]
            SET 
                DIEMCHUYENCAN = @P_DIEM_CC,
                DIEMGIUAKY = @P_DIEM_GK,
                DIEMCUOIKY = @P_DIEM_CK
            WHERE SINHVIEN_ID = @P_SINHVIEN_ID AND LOPHOCPHAN_ID = @P_LOPHOCPHAN_ID;

            SELECT 200 AS StatusCode, N'Nhập điểm thành công!' AS Message;
        END
        ELSE
        BEGIN
            SELECT 404 AS StatusCode, N'Lỗi: Không tìm thấy sinh viên trong danh sách lớp hoặc sinh viên đã hủy môn!' AS Message;
        END
    END TRY
    BEGIN CATCH
        -- Bắt lỗi hệ thống
        SELECT 500 AS StatusCode, ERROR_MESSAGE() AS Message;
    END CATCH
END
GO