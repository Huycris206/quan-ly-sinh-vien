USE [QuanLyHoSoSinhVien]
GO
CREATE OR ALTER TRIGGER [dbo].[TRG_UPD_DIEM_TUDONG]
ON [dbo].[KETQUAHOCTAP]
AFTER UPDATE
AS
BEGIN
    -- Hàm IF UPDATE() kiểm tra xem có đúng là giảng viên vừa nhập điểm hay không
    IF UPDATE(DIEMCHUYENCAN) OR UPDATE(DIEMGIUAKY) OR UPDATE(DIEMCUOIKY)
    BEGIN
        UPDATE kq
        SET 
            -- Công thức: CC (10%) + GK (30%) + CK (60%)
            kq.DIEMTONGKET = ROUND((i.DIEMCHUYENCAN * 0.1) + (i.DIEMGIUAKY * 0.3) + (i.DIEMCUOIKY * 0.6), 1),
            
            -- Xếp loại điểm chữ (Giống như xét hạng VIP trong đồ án)
            kq.DIEMHECHU = CASE 
                WHEN ((i.DIEMCHUYENCAN*0.1) + (i.DIEMGIUAKY*0.3) + (i.DIEMCUOIKY*0.6)) >= 8.5 THEN 'A'
                WHEN ((i.DIEMCHUYENCAN*0.1) + (i.DIEMGIUAKY*0.3) + (i.DIEMCUOIKY*0.6)) >= 7.0 THEN 'B'
                WHEN ((i.DIEMCHUYENCAN*0.1) + (i.DIEMGIUAKY*0.3) + (i.DIEMCUOIKY*0.6)) >= 5.5 THEN 'C'
                WHEN ((i.DIEMCHUYENCAN*0.1) + (i.DIEMGIUAKY*0.3) + (i.DIEMCUOIKY*0.6)) >= 4.0 THEN 'D'
                ELSE 'F'
            END,
            kq.NGAYCAPNHAT = GETDATE()
        FROM [dbo].[KETQUAHOCTAP] kq
        INNER JOIN inserted i ON kq.SINHVIEN_ID = i.SINHVIEN_ID AND kq.LOPHOCPHAN_ID = i.LOPHOCPHAN_ID;
    END
END
GO