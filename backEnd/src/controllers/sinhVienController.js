import { SinhVien, ChuyenNganh, Nganh, TaiKhoan, sequelize } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const getAllSinhVien = async (req, res) => {
    try {
        const danhSach = await SinhVien.findAll({
            where: { DAXOA: false },
            include: [
                {
                    model: ChuyenNganh,
                    attributes: ['TENCHUYENNGANH'],
                    include: [
                        {
                            model: Nganh,
                            attributes: ['TENNGANH']
                        }
                    ]
                },
                {
                    model: TaiKhoan,
                    attributes: ['TENDANGNHAP', 'VAITRO']
                }
            ]
        });
        return res.status(200).json({
            success: true,
            data: danhSach
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sinh viên',
            error: error.message
        });
    }
};

export const getSinhVienById = async (req, res) => {
    const { id } = req.params;
    try {
        const sinhVien = await SinhVien.findOne({
            where: { ID: id, DAXOA: false },
            include: [
                {
                    model: ChuyenNganh,
                    attributes: ['TENCHUYENNGANH'],
                    include: [
                        {
                            model: Nganh,
                            attributes: ['TENNGANH']
                        }
                    ]
                },
                {
                    model: TaiKhoan,
                    attributes: ['TENDANGNHAP', 'VAITRO']
                }
            ]
        });
        if (!sinhVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên!'
            });
        }
        return res.status(200).json({
            success: true,
            data: sinhVien
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin sinh viên',
            error: error.message
        });
    }
};

export const createSinhVien = async (req, res) => {
    try {
        const {
            MATKHAU, HOTEN, GIOITINH, NGAYSINH, SDT, EMAIL, 
            CCCD, QUEQUAN, DIACHI, TRANGTHAI, CHUYENNGANH_ID
        } = req.body;
        if(!CHUYENNGANH_ID) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu Chuyên ngành để tạo sinh viên!'
            });
        }
        const checkChuyenNganh = await ChuyenNganh.findOne({ where: { ID: CHUYENNGANH_ID, DAXOA: false } });
        if (!checkChuyenNganh) {
            return res.status(404).json({ success: false, message: 'Chuyên ngành không tồn tại trong hệ thống!' });
        }
        // Bắt lỗi ngay từ cửa: Không có CCCD thì không thể tạo Tên Đăng Nhập
        if (!CCCD) {
            return res.status(400).json({ success: false, message: 'Thiếu CCCD!' });
        }

        // Tự động giả lập MASV y hệt Trigger để Node.js lấy làm Tên Đăng Nhập và đi tìm data
        const MASV_GENERATED = 'SV' + CCCD;

        // Băm mật khẩu
        const passwordToHash = MATKHAU || '123456';
        const hashedPassword = await bcrypt.hash(passwordToHash, 10);

        // Gọi SP với CHÍNH XÁC 10 THAM SỐ (đã bỏ @P_MASV)
        await sequelize.query(
            `EXEC [dbo].[PRO_THEM_SINHVIEN] 
                @P_TENDANGNHAP = :username, 
                @P_MATKHAU = :password,
                @P_HOTEN = :hoten, 
                @P_GIOITINH = :gioitinh,
                @P_NGAYSINH = :ngaysinh, 
                @P_SDT = :sdt, 
                @P_EMAIL = :email,
                @P_CCCD = :cccd, 
                @P_CHUYENNGANH_ID = :chuyennganh_id`,
            
            {
                replacements: {
                    username: MASV_GENERATED, 
                    password: hashedPassword,
                    hoten: HOTEN,
                    gioitinh: GIOITINH || null, 
                    ngaysinh: NGAYSINH || null, 
                    sdt: SDT || null, 
                    email: EMAIL || null,
                    cccd: CCCD, 
                    chuyennganh_id: CHUYENNGANH_ID,
                },
                type: sequelize.QueryTypes.RAW
            }
        );

        // Tìm lại Sinh viên vừa tạo để trả về Client
        const newSinhVien = await SinhVien.findOne({
            where: { MASV: MASV_GENERATED, DAXOA: false },
            include: [{ 
                model: TaiKhoan, 
                attributes: ['ID', 'TENDANGNHAP', 'VAITRO', 'NGAYTAO'] 
            }]
        });
        
        return res.status(201).json({
            success: true,
            message: 'Thêm sinh viên thành công',
            data: newSinhVien
        });

    } catch (error) {
        console.error("=== LỖI CỤ THỂ ===", error); 
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm sinh viên',
            error: error.message || "Lỗi không xác định"
        });
    }
};

export const updateSinhVien = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const sinhVien = await SinhVien.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!sinhVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên!'
            });
        }
        await sinhVien.update(updateData);
        return res.status(200).json({
            success: true,
            message: 'Cập nhật sinh viên thành công',
            data: sinhVien
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật sinh viên',
            error: error.message
        });
    }
};

export const deleteSinhVien = async (req, res) => {
    const { id } = req.params;
    try {
        const sinhVien = await SinhVien.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!sinhVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên!'
            });
        }
        await sinhVien.update({ DAXOA: true });
        return res.status(200).json({
            success: true,
            message: 'Xóa sinh viên thành công'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa sinh viên',
            error: error.message
        });
    }
};
