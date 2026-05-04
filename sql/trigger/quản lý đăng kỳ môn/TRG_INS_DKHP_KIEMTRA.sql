USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER TRIGGER [dbo].[TRG_INS_DKHP_KIEMTRA]
ON [dbo].[KETQUAHOCTAP]
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @SinhVienId UNIQUEIDENTIFIER, @LopHocPhanId UNIQUEIDENTIFIER, @MonHocId UNIQUEIDENTIFIER;
    DECLARE @SiSoHienTai INT, @SiSoToiDa INT, @TrangThaiLop VARCHAR(20), @HocKy VARCHAR(20) ,@TrangThaiSinhVien VARCHAR(20);
    DECLARE @SoMonTienQuyetChuaDat INT = 0;
    DECLARE @SoLuongTrungLich INT = 0;

    SELECT @SinhVienId = SINHVIEN_ID, @LopHocPhanId = LOPHOCPHAN_ID FROM inserted;

    -- 1. Lấy thông tin lớp học phần
    SELECT 
        @SiSoToiDa = SISO_TOIDA, 
        @TrangThaiLop = TRANGTHAI, 
        @MonHocId = MONHOC_ID,
        @HocKy = HOCKY 
    FROM [dbo].[LOPHOCPHAN] WHERE ID = @LopHocPhanId;

    SELECT
        @TrangThaiSinhVien = TRANGTHAI
    FROM [dbo].[SINHVIEN] WHERE ID = @SinhVienId;

     -- Bắt lỗi 0: Sinh viên không được phép đăng ký
    IF (@TrangThaiSinhVien != 'DangHoc')
    BEGIN
        RAISERROR (N'Lỗi: Sinh viên không được phép đăng ký học phần!', 16, 1);
        ROLLBACK TRANSACTION; RETURN;
    END

    -- Bắt lỗi 1: Lớp không mở
    IF (@TrangThaiLop != 'Mo')
    BEGIN
        RAISERROR (N'Lỗi: Lớp học phần này không cho phép đăng ký!', 16, 1);
        ROLLBACK TRANSACTION; RETURN;
    END

    -- Bắt lỗi 2: Lớp đã đầy sĩ số
    SELECT @SiSoHienTai = COUNT(*) FROM [dbo].[KETQUAHOCTAP] 
    WHERE LOPHOCPHAN_ID = @LopHocPhanId AND TRANGTHAI_DANGKY != 'DaHuy';

    IF (@SiSoHienTai >= @SiSoToiDa)
    BEGIN
        RAISERROR (N'Lỗi: Lớp học phần đã vượt sĩ số tối đa!', 16, 1);
        ROLLBACK TRANSACTION; RETURN;
    END

    -- Bắt lỗi 3: Kiểm tra môn tiên quyết
    SELECT @SoMonTienQuyetChuaDat = COUNT(*)
    FROM [dbo].[MONTIENQUYET] mtq
    LEFT JOIN [dbo].[KETQUAHOCTAP] kq 
        ON mtq.MONHOC_TRUOC_ID = kq.LOPHOCPHAN_ID AND kq.SINHVIEN_ID = @SinhVienId
    WHERE mtq.MONHOC_ID = @MonHocId 
      AND (kq.DIEMTONGKET IS NULL OR kq.DIEMTONGKET < 4.0); 

    IF (@SoMonTienQuyetChuaDat > 0)
    BEGIN
        RAISERROR (N'Lỗi: Sinh viên chưa hoàn thành môn học tiên quyết!', 16, 1);
        ROLLBACK TRANSACTION; RETURN;
    END

    -- =========================================================================
    -- BẮT LỖI 4: KIỂM TRA TRÙNG THỜI KHÓA BIỂU
    -- =========================================================================
    SELECT @SoLuongTrungLich = COUNT(*)
    FROM inserted i
    -- 4.1. Lấy lịch học của lớp phần sinh viên ĐANG ĐỊNH đăng ký
    INNER JOIN [dbo].[LICHHOC] lh_moi ON i.LOPHOCPHAN_ID = lh_moi.LOPHOCPHAN_ID
    
    -- 4.2. Lấy danh sách các môn mà sinh viên này ĐÃ ĐĂNG KÝ (không tính môn đã hủy)
    INNER JOIN [dbo].[KETQUAHOCTAP] kq ON i.SINHVIEN_ID = kq.SINHVIEN_ID AND kq.TRANGTHAI_DANGKY != 'DaHuy'
    
    -- 4.3. Đảm bảo môn cũ đó phải học CÙNG HỌC KỲ với môn mới
    INNER JOIN [dbo].[LOPHOCPHAN] lhp_cu ON kq.LOPHOCPHAN_ID = lhp_cu.ID AND lhp_cu.HOCKY = @HocKy
    
    -- 4.4. Lấy lịch học của các môn ĐÃ ĐĂNG KÝ
    INNER JOIN [dbo].[LICHHOC] lh_cu ON kq.LOPHOCPHAN_ID = lh_cu.LOPHOCPHAN_ID
    
    WHERE 
        lh_moi.THU = lh_cu.THU -- Cùng học một thứ trong tuần
        AND lh_moi.TIET_BATDAU <= lh_cu.TIET_KETTHUC -- Tiết bắt đầu môn này sớm hơn hoặc bằng tiết kết thúc môn kia
        AND lh_moi.TIET_KETTHUC >= lh_cu.TIET_BATDAU; -- Tiết kết thúc môn này muộn hơn hoặc bằng tiết bắt đầu môn kia

    IF (@SoLuongTrungLich > 0)
    BEGIN
        RAISERROR (N'Lỗi: Lớp học phần này bị trùng thời khóa biểu với một môn khác bạn đã đăng ký!', 16, 1);
        ROLLBACK TRANSACTION; RETURN;
    END
    -- =========================================================================

    -- Hợp lệ -> Tiến hành chèn dữ liệu
    INSERT INTO [dbo].[KETQUAHOCTAP] (SINHVIEN_ID, LOPHOCPHAN_ID, TRANGTHAI_DANGKY)
    SELECT SINHVIEN_ID, LOPHOCPHAN_ID, 'ThanhCong' FROM inserted;
    UPDATE [dbo].[LOPHOCPHAN]
    SET SISO = SISO + 1
    WHERE ID = @LopHocPhanId;
END
GO