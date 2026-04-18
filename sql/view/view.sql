USE [QuanLyHoSoSinhVien]
GO

-- ==========================================
-- 4. TẠO CÁC VIEW BÁO CÁO & TRUY VẤN
-- ==========================================

-- View 1: Truy vấn danh sách sinh viên theo Khoa/Ngành đầy đủ thông tin
CREATE VIEW [dbo].[View_HoSoSinhVien]
AS
SELECT 
    sv.MASV,
    sv.HOTEN,
    sv.GIOITINH,
    sv.KHOAHOC,
    cn.TENCHUYENNGANH,
    n.TENNGANH,
    sv.TRANGTHAI,
    sv.SDT,
    sv.EMAIL,
    sv.NGAYTAO
FROM 
    [dbo].[SINHVIEN] sv
INNER JOIN 
    [dbo].[CHUYENNGANH] cn ON sv.CHUYENNGANH_ID = cn.ID
INNER JOIN 
    [dbo].[NGANH] n ON cn.NGANH_ID = n.ID;
GO

-- View 2: Xem chi tiết bảng điểm của sinh viên (kèm trạng thái đăng ký môn)
CREATE VIEW [dbo].[View_BangDiemChiTiet]
AS
SELECT 
    sv.MASV,
    sv.HOTEN,
    mh.TENMONHOC,
    mh.SOTINCHI,
    lhp.MALOP,
    lhp.HOCKY,
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
    [dbo].[MONHOC] mh ON lhp.MONHOC_ID = mh.ID;
GO

-- View 3: Lấy Thời khóa biểu của sinh viên theo Học kỳ (Chỉ lấy môn đăng ký thành công)
CREATE VIEW [dbo].[View_ThoiKhoaBieu]
AS
SELECT 
    sv.MASV,
    sv.HOTEN,
    lhp.HOCKY,
    mh.TENMONHOC,
    lh.THU,
    lh.TIET_BATDAU,
    lh.TIET_KETTHUC,
    lh.PHONGHOC
FROM 
    [dbo].[KETQUAHOCTAP] kq
INNER JOIN 
    [dbo].[SINHVIEN] sv ON kq.SINHVIEN_ID = sv.ID
INNER JOIN 
    [dbo].[LOPHOCPHAN] lhp ON kq.LOPHOCPHAN_ID = lhp.ID
INNER JOIN 
    [dbo].[MONHOC] mh ON lhp.MONHOC_ID = mh.ID
INNER JOIN 
    [dbo].[LICHHOC] lh ON lh.LOPHOCPHAN_ID = lhp.ID
WHERE 
    kq.TRANGTHAI_DANGKY = 'ThanhCong';
GO