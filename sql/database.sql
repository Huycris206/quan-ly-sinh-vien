USE [QuanLyHoSoSinhVien]
GO

-- ==========================================
-- 1. TẠO BẢNG
-- ==========================================

CREATE TABLE [dbo].[TAIKHOAN](
	[ID] [uniqueidentifier] NOT NULL DEFAULT newid(),
	[TENDANGNHAP] [varchar](100) NOT NULL,
	[MATKHAU] [varchar](255) NOT NULL,
	[VAITRO] [varchar](20) DEFAULT 'sinhvien', -- 'sinhvien', 'giangvien', 'quantri'
	[ANHDAIDIEN] [nvarchar](500) NULL,
	[NGAYTAO] [datetime2](7) DEFAULT getdate(),
	[NGAYCAPNHAT] [datetime2](7) DEFAULT getdate(),
	[DAXOA] [bit] DEFAULT 0,
PRIMARY KEY CLUSTERED ([ID] ASC),
UNIQUE NONCLUSTERED ([TENDANGNHAP] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[NGANH](
	[ID] [uniqueidentifier] NOT NULL DEFAULT newid(),
	[TENNGANH] [nvarchar](100) NOT NULL,
	[NGAYTAO] [datetime2](7) DEFAULT getdate(),
	[NGAYCAPNHAT] [datetime2](7) DEFAULT getdate(),
	[DAXOA] [bit] DEFAULT 0,
PRIMARY KEY CLUSTERED ([ID] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[CHUYENNGANH](
	[ID] [uniqueidentifier] NOT NULL DEFAULT newid(),
	[NGANH_ID] [uniqueidentifier] NOT NULL,
	[TENCHUYENNGANH] [nvarchar](100) NOT NULL,
	[NGAYTAO] [datetime2](7) DEFAULT getdate(),
	[NGAYCAPNHAT] [datetime2](7) DEFAULT getdate(),
	[DAXOA] [bit] DEFAULT 0,
PRIMARY KEY CLUSTERED ([ID] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[SINHVIEN](
	[ID] [uniqueidentifier] NOT NULL DEFAULT newid(),
	[TAIKHOAN_ID] [uniqueidentifier] NOT NULL,
	[MASV] [varchar](20) NOT NULL,
	[HOTEN] [nvarchar](100) NOT NULL,
	[GIOITINH] [nvarchar](10) NULL,
	[NGAYSINH] [date] NULL,
	[SDT] [varchar](15) NULL,
	[EMAIL] [varchar](100) NULL,
	[CCCD] [varchar](20) NULL,
	[QUEQUAN] [nvarchar](255) NULL,
	[DIACHI] [nvarchar](255) NULL,
	[KHOAHOC] [varchar](20) NULL,
	[CHUYENNGANH_ID] [uniqueidentifier] NOT NULL,
	[TRANGTHAI] [varchar](20) DEFAULT 'DangHoc', 
	[NGAYTAO] [datetime2](7) DEFAULT getdate(),
	[NGAYCAPNHAT] [datetime2](7) DEFAULT getdate(),
	[DAXOA] [bit] DEFAULT 0,
PRIMARY KEY CLUSTERED ([ID] ASC),
UNIQUE NONCLUSTERED ([TAIKHOAN_ID] ASC),
UNIQUE NONCLUSTERED ([MASV] ASC),
UNIQUE NONCLUSTERED ([CCCD] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[GIANGVIEN](
	[ID] [uniqueidentifier] NOT NULL DEFAULT newid(),
	[TAIKHOAN_ID] [uniqueidentifier] NOT NULL,
	[MAGV] [varchar](20) NOT NULL,
	[HOTEN] [nvarchar](100) NOT NULL,
	[GIOITINH] [nvarchar](10) NULL,
	[NGAYSINH] [date] NULL,
	[CCCD] [varchar](20) NULL,
	[SDT] [varchar](15) NULL,
	[NGAYTAO] [datetime2](7) DEFAULT getdate(),
	[NGAYCAPNHAT] [datetime2](7) DEFAULT getdate(),
	[DAXOA] [bit] DEFAULT 0,
PRIMARY KEY CLUSTERED ([ID] ASC),
UNIQUE NONCLUSTERED ([TAIKHOAN_ID] ASC),
UNIQUE NONCLUSTERED ([MAGV] ASC),
UNIQUE NONCLUSTERED ([CCCD] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[MONHOC](
	[ID] [uniqueidentifier] NOT NULL DEFAULT newid(),
	[TENMONHOC] [nvarchar](100) NOT NULL,
	[SOTINCHI] [int] NOT NULL,
	[NGAYTAO] [datetime2](7) DEFAULT getdate(),
	[NGAYCAPNHAT] [datetime2](7) DEFAULT getdate(),
	[DAXOA] [bit] DEFAULT 0,
PRIMARY KEY CLUSTERED ([ID] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[CHUONGTRINHDAOTAO](
	[CHUYENNGANH_ID] [uniqueidentifier] NOT NULL,
	[MONHOC_ID] [uniqueidentifier] NOT NULL,
	[LOAIMON] [varchar](20) DEFAULT 'BatBuoc',
	[NGAYTAO] [datetime2](7) DEFAULT getdate(),
PRIMARY KEY CLUSTERED ([CHUYENNGANH_ID] ASC, [MONHOC_ID] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[LOPHOCPHAN](
	[ID] [uniqueidentifier] NOT NULL DEFAULT newid(),
	[MALOP] [varchar](50) NOT NULL,
	[MONHOC_ID] [uniqueidentifier] NOT NULL,
	[GIANGVIEN_ID] [uniqueidentifier] NULL,
	[HOCKY] [varchar](20) NOT NULL,
	[SISO_TOIDA] [int] DEFAULT 70,
	[TRANGTHAI] [varchar](20) DEFAULT 'Mo',
	[NGAYTAO] [datetime2](7) DEFAULT getdate(),
	[NGAYCAPNHAT] [datetime2](7) DEFAULT getdate(),
	[DAXOA] [bit] DEFAULT 0,
PRIMARY KEY CLUSTERED ([ID] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[KETQUAHOCTAP](
	[SINHVIEN_ID] [uniqueidentifier] NOT NULL,
	[LOPHOCPHAN_ID] [uniqueidentifier] NOT NULL,
	[DIEMCHUYENCAN] [float] NULL,
	[DIEMGIUAKY] [float] NULL,
	[DIEMCUOIKY] [float] NULL,
	[DIEMTONGKET] [float] NULL,
	[DIEMHECHU] [varchar](5) NULL,
	[NGAYTAO] [datetime2](7) DEFAULT getdate(),
	[NGAYCAPNHAT] [datetime2](7) DEFAULT getdate(),
PRIMARY KEY CLUSTERED ([SINHVIEN_ID] ASC, [LOPHOCPHAN_ID] ASC)
) ON [PRIMARY]
GO
CREATE TABLE [dbo].[MONTIENQUYET](
	[MONHOC_ID] [uniqueidentifier] NOT NULL,
	[MONHOC_TRUOC_ID] [uniqueidentifier] NOT NULL,
	[LOAIDIEUKIEN] [varchar](20) DEFAULT 'TienQuyet', -- 'TienQuyet' (Phải qua môn), 'HocTruoc' (Chỉ cần từng học)
PRIMARY KEY CLUSTERED ([MONHOC_ID] ASC, [MONHOC_TRUOC_ID] ASC),
FOREIGN KEY([MONHOC_ID]) REFERENCES [dbo].[MONHOC] ([ID]),
FOREIGN KEY([MONHOC_TRUOC_ID]) REFERENCES [dbo].[MONHOC] ([ID])
) ON [PRIMARY]
GO

-- 2. Bảng Lịch học (Giải quyết thời khóa biểu)
CREATE TABLE [dbo].[LICHHOC](
	[ID] [uniqueidentifier] NOT NULL DEFAULT newid(),
	[LOPHOCPHAN_ID] [uniqueidentifier] NOT NULL,
	[THU] [int] NOT NULL, -- Từ 2 đến 8 (Chủ nhật)
	[TIET_BATDAU] [int] NOT NULL, -- Tiết 1 đến 12
	[TIET_KETTHUC] [int] NOT NULL,
	[PHONGHOC] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED ([ID] ASC),
FOREIGN KEY([LOPHOCPHAN_ID]) REFERENCES [dbo].[LOPHOCPHAN] ([ID]),
CHECK ([THU] >= 2 AND [THU] <= 8),
CHECK ([TIET_BATDAU] > 0 AND [TIET_KETTHUC] >= [TIET_BATDAU])
) ON [PRIMARY]
GO

-- 3. Cập nhật bảng Kết quả học tập (Để quản lý trạng thái lúc đăng ký)
ALTER TABLE [dbo].[KETQUAHOCTAP]
ADD [TRANGTHAI_DANGKY] [varchar](20) DEFAULT 'ThanhCong';
GO

ALTER TABLE [dbo].[KETQUAHOCTAP] 
ADD CHECK ([TRANGTHAI_DANGKY] IN ('ThanhCong', 'ChoDuyet', 'DaHuy'));
GO






-- ==========================================
-- 2. THIẾT LẬP KHÓA NGOẠI (FOREIGN KEYS)
-- ==========================================

ALTER TABLE [dbo].[CHUYENNGANH] ADD FOREIGN KEY([NGANH_ID]) REFERENCES [dbo].[NGANH] ([ID])
GO
ALTER TABLE [dbo].[SINHVIEN] ADD FOREIGN KEY([TAIKHOAN_ID]) REFERENCES [dbo].[TAIKHOAN] ([ID])
GO
ALTER TABLE [dbo].[SINHVIEN] ADD FOREIGN KEY([CHUYENNGANH_ID]) REFERENCES [dbo].[CHUYENNGANH] ([ID])
GO
ALTER TABLE [dbo].[GIANGVIEN] ADD FOREIGN KEY([TAIKHOAN_ID]) REFERENCES [dbo].[TAIKHOAN] ([ID])
GO
ALTER TABLE [dbo].[CHUONGTRINHDAOTAO] ADD FOREIGN KEY([CHUYENNGANH_ID]) REFERENCES [dbo].[CHUYENNGANH] ([ID])
GO
ALTER TABLE [dbo].[CHUONGTRINHDAOTAO] ADD FOREIGN KEY([MONHOC_ID]) REFERENCES [dbo].[MONHOC] ([ID])
GO
ALTER TABLE [dbo].[LOPHOCPHAN] ADD FOREIGN KEY([MONHOC_ID]) REFERENCES [dbo].[MONHOC] ([ID])
GO
ALTER TABLE [dbo].[LOPHOCPHAN] ADD FOREIGN KEY([GIANGVIEN_ID]) REFERENCES [dbo].[GIANGVIEN] ([ID])
GO
ALTER TABLE [dbo].[KETQUAHOCTAP] ADD FOREIGN KEY([SINHVIEN_ID]) REFERENCES [dbo].[SINHVIEN] ([ID])
GO
ALTER TABLE [dbo].[KETQUAHOCTAP] ADD FOREIGN KEY([LOPHOCPHAN_ID]) REFERENCES [dbo].[LOPHOCPHAN] ([ID])
GO


-- ==========================================
-- 3. THIẾT LẬP RÀNG BUỘC KIỂM TRA (CHECK CONSTRAINTS)
-- ==========================================

ALTER TABLE [dbo].[TAIKHOAN] ADD CHECK ([VAITRO] IN ('sinhvien', 'giangvien', 'quantri'))
GO
ALTER TABLE [dbo].[SINHVIEN] ADD CHECK ([GIOITINH] IN (N'Nam', N'Nữ', N'Khác'))
GO
ALTER TABLE [dbo].[SINHVIEN] ADD CHECK ([TRANGTHAI] IN ('DangHoc', 'BaoLuu', 'ThoiHoc', 'TotNghiep'))
GO
ALTER TABLE [dbo].[GIANGVIEN] ADD CHECK ([GIOITINH] IN (N'Nam', N'Nữ', N'Khác'))
GO
ALTER TABLE [dbo].[CHUONGTRINHDAOTAO] ADD CHECK ([LOAIMON] IN ('BatBuoc', 'TuChon'))
GO
ALTER TABLE [dbo].[LOPHOCPHAN] ADD CHECK ([TRANGTHAI] IN ('Mo', 'Dong', 'DangHoc', 'KetThuc', 'Huy'))
GO
ALTER TABLE [dbo].[KETQUAHOCTAP] ADD CHECK ([DIEMCHUYENCAN] >= 0.0 AND [DIEMCHUYENCAN] <= 10.0)
GO
ALTER TABLE [dbo].[KETQUAHOCTAP] ADD CHECK ([DIEMGIUAKY] >= 0.0 AND [DIEMGIUAKY] <= 10.0)
GO
ALTER TABLE [dbo].[KETQUAHOCTAP] ADD CHECK ([DIEMCUOIKY] >= 0.0 AND [DIEMCUOIKY] <= 10.0)
GO
ALTER TABLE [dbo].[KETQUAHOCTAP] ADD CHECK ([DIEMTONGKET] >= 0.0 AND [DIEMTONGKET] <= 10.0)
GO