USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER PROCEDURE [dbo].[PRO_NHAP_DIEM]
    @P_SINHVIEN_ID UNIQUEIDENTIFIER,
    @P_LOPHOCPHAN_ID UNIQUEIDENTIFIER,
    -- Gán giá trị mặc định là NULL ngay tại tham số đầu vào để phòng hờ an toàn 2 lớp
    @P_DIEM_CC FLOAT = NULL, 
    @P_DIEM_GK FLOAT = NULL,
    @P_DIEM_CK FLOAT = NULL
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
            -- Dùng ISNULL: Nếu @P_DIEM_CC bị null, lấy giá trị DIEMCHUYENCAN hiện tại đắp vào.
            UPDATE [dbo].[KETQUAHOCTAP]
            SET 
                DIEMCHUYENCAN = ISNULL(@P_DIEM_CC, DIEMCHUYENCAN),
                DIEMGIUAKY = ISNULL(@P_DIEM_GK, DIEMGIUAKY),
                DIEMCUOIKY = ISNULL(@P_DIEM_CK, DIEMCUOIKY)
            WHERE SINHVIEN_ID = @P_SINHVIEN_ID AND LOPHOCPHAN_ID = @P_LOPHOCPHAN_ID;

            SELECT 200 AS StatusCode, N'Nhập/Cập nhật điểm thành công!' AS Message;
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