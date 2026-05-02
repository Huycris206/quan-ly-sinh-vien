USE [QuanLyHoSoSinhVien]
GO

CREATE OR ALTER VIEW [dbo].[View_DanhSachSinhVien_TheoLop]
AS
SELECT 
    lhp.ID AS LOPHOCPHAN_ID,
    lhp.MALOP,
    mh.TENMONHOC,
    sv.ID AS SINHVIEN_ID,
    sv.MASV,
    sv.HOTEN,
    sv.GIOITINH,
    sv.SDT,
    sv.TRANGTHAI, 
    -- Sửa lại chỗ này: Chỉ đặt tên là TENCHUYENNGANH
    cn.TENCHUYENNGANH AS TENCHUYENNGANH, 
    
    kq.TRANGTHAI_DANGKY,
    kq.DIEMCHUYENCAN,
    kq.DIEMGIUAKY,
    kq.DIEMCUOIKY,
    kq.DIEMTONGKET,
    kq.DIEMHECHU
FROM 
    [dbo].[KETQUAHOCTAP] kq
INNER JOIN 
    [dbo].[SINHVIEN] sv ON kq.SINHVIEN_ID = sv.ID
INNER JOIN 
    [dbo].[LOPHOCPHAN] lhp ON kq.LOPHOCPHAN_ID = lhp.ID
INNER JOIN 
    [dbo].[MONHOC] mh ON lhp.MONHOC_ID = mh.ID
LEFT JOIN 
    [dbo].[CHUYENNGANH] cn ON sv.CHUYENNGANH_ID = cn.ID
WHERE 
    kq.TRANGTHAI_DANGKY = 'ThanhCong';
GO