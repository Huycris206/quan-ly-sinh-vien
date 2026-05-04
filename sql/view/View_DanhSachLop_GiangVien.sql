USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER VIEW [dbo].[View_DanhSachLop_GiangVien]
AS
SELECT 
    -- 1. Thông tin Giảng viên
    GV.ID AS GIANGVIEN_ID,
    GV.MAGV,
    GV.HOTEN AS TENGIANGVIEN,
    GV.SDT,
    
    -- 2. Thông tin Lớp học phần
    LHP.ID AS LOPHOCPHAN_ID,
    LHP.MALOP,
    LHP.HOCKY,
    LHP.SISO,
    LHP.SISO_TOIDA,
    LHP.TRANGTHAI AS TRANGTHAI_LOP,
    LHP.NGAYTAO AS NGAYTAOLOP,
    
    -- 3. Thông tin Môn học
    MH.ID AS MONHOC_ID,
    MH.TENMONHOC,
    MH.SOTINCHI

FROM 
    [dbo].[GIANGVIEN] GV
INNER JOIN 
    [dbo].[LOPHOCPHAN] LHP ON GV.ID = LHP.GIANGVIEN_ID
INNER JOIN 
    [dbo].[MONHOC] MH ON LHP.MONHOC_ID = MH.ID
WHERE 
    LHP.DAXOA = 0 
    AND GV.DAXOA = 0 
    AND MH.DAXOA = 0;
GO