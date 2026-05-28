USE [QuanLyHoSoSinhVien]
;
GO

-- 2. Tạo Trigger INSTEAD OF INSERT

CREATE OR ALTER TRIGGER [dbo].[TRG_INS_GV_TAO_MAGV]
ON [dbo].[GIANGVIEN]
INSTEAD OF INSERT 
AS
BEGIN
    INSERT INTO [dbo].[GIANGVIEN] (
        [ID], [TAIKHOAN_ID], [MAGV], [HOTEN], [GIOITINH], [NGAYSINH],[CCCD],
        [SDT], [NGAYTAO], [NGAYCAPNHAT], [DAXOA]
    )
    SELECT 
        ISNULL(ID, NEWID()), 
        TAIKHOAN_ID, 
        -- Công thức tạo MAGV: GV + CCCD
        'GV' + CCCD,
        HOTEN, GIOITINH, NGAYSINH,CCCD, SDT, NGAYTAO, NGAYCAPNHAT, DAXOA
    FROM inserted;
END
GO