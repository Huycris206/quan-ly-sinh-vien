-- 1. Tạo Sequence đếm số thứ tự cho Lớp học phần
CREATE SEQUENCE seq_LopHocPhan AS INT START WITH 1 INCREMENT BY 1;
GO

-- 2. Tạo Trigger INSTEAD OF INSERT
CREATE OR ALTER TRIGGER [dbo].[TRG_INS_LHP_TAO_MALOP]
ON [dbo].[LOPHOCPHAN]
INSTEAD OF INSERT 
AS
BEGIN
    INSERT INTO [dbo].[LOPHOCPHAN] (
        [ID], [MALOP], [MONHOC_ID], [GIANGVIEN_ID], [HOCKY], 
        [SISO_TOIDA], [TRANGTHAI], [NGAYTAO], [NGAYCAPNHAT], [DAXOA]
    )
    SELECT 
        ISNULL(ID, NEWID()), 
        -- Công thức tạo MALOP: LHP + Năm(2 số) + STT(4 số)
        'LHP' + RIGHT(CAST(YEAR(GETDATE()) AS VARCHAR(4)), 2) 
              + RIGHT('0000' + CAST(NEXT VALUE FOR seq_LopHocPhan AS VARCHAR(4)), 4),
        MONHOC_ID, GIANGVIEN_ID, HOCKY, SISO_TOIDA, TRANGTHAI, 
        NGAYTAO, NGAYCAPNHAT, DAXOA
    FROM inserted;
END
GO