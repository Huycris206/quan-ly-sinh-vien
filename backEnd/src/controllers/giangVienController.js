import { GiangVien, TaiKhoan,sequelize } from "../models/index.js";
import bcrypt from 'bcryptjs';

export const getAllGiangVien = async (req, res) => {
    try {
        const giangViens = await GiangVien.findAll({
            where: { DAXOA: false },
            include: [{
                model: TaiKhoan,
                attributes: ['TENDANGNHAP', 'VAITRO']
            }]
        });
        return res.status(200).json({
            success: true,
            data: giangViens
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách giảng viên',
            error: error.message
        });
    }
};

export const getGiangVienById = async (req, res) => {
    const { id } = req.params;
    try {
        const giangVien = await GiangVien.findOne({
            where: { ID: id, DAXOA: false },
            include: [{
                model: TaiKhoan,
                attributes: ['USERNAME', 'ROLE']
            }]
        });
        if (!giangVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giảng viên'
            });
        }
        return res.status(200).json({
            success: true,
            data: giangVien
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin giảng viên',
            error: error.message
        });
    }
};

export const createGiangVien = async (req, res) => {
    // 1. Không lấy MAGV từ body nữa
    const { MATKHAU, HOTEN, GIOITINH, NGAYSINH, SDT, CCCD } = req.body;

    // 2. Kiểm tra CCCD ngay từ đầu
    if (!CCCD) {
        return res.status(400).json({ success: false, message: 'Thiếu CCCD để tạo Mã Giảng Viên!' });
    }

    // 3. Tự giả lập MAGV y hệt Trigger dưới DB (giả sử là 'GV' + CCCD)
    const MAGV_GENERATED = 'GV' + CCCD;

    try {
        // 4. Băm mật khẩu
        const passwordToHash = MATKHAU || '123456';
        const hashedPassword = await bcrypt.hash(passwordToHash, 10);

        // 5. Gọi Stored Procedure
        await sequelize.query(
            `EXEC [dbo].[PRO_THEM_GIANGVIEN] 
                @P_TENDANGNHAP = :username, 
                @P_MATKHAU = :password,
                @P_HOTEN = :hoten, 
                @P_GIOITINH = :gioitinh,
                @P_NGAYSINH = :ngaysinh, 
                @P_SDT = :sdt, 
                @P_CCCD = :cccd`,
            {
                replacements: {
                    username: MAGV_GENERATED, // Dùng mã vừa tạo làm username
                    password: hashedPassword,
                    hoten: HOTEN,
                    gioitinh: GIOITINH || null, // Thêm || null để chống lỗi
                    ngaysinh: NGAYSINH || null,
                    sdt: SDT || null,
                    cccd: CCCD
                },
                type: sequelize.QueryTypes.RAW
            }
        );

        // 6. Tìm lại Giảng viên vừa tạo
        const newGiangVien = await GiangVien.findOne({
            where: { MAGV: MAGV_GENERATED, DAXOA: false }, // ĐÃ SỬA LỖI GÕ NHẦM MAGVV
            include: [{ 
                model: TaiKhoan, 
                attributes: ['ID', 'TENDANGNHAP', 'VAITRO', 'NGAYTAO'] 
            }]
        });

        // 7. Nhớ trả data về cho Front-end
        return res.status(201).json({
            success: true,
            message: 'Tạo hồ sơ Giảng viên và Tài khoản thành công!',
            data: newGiangVien // Bổ sung data ở đây
        });

    } catch (error) {
        console.error("=== LỖI TẠO GIẢNG VIÊN ===", error);
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi khi tạo giảng viên', 
            error: error.message 
        });
    }
};

export const updateGiangVien = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const giangVien = await GiangVien.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!giangVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giảng viên'
            });
        }
        await giangVien.update(updateData);
        return res.status(200).json({
            success: true,
            message: 'Cập nhật giảng viên thành công',
            data: giangVien
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật giảng viên',
            error: error.message
        });
    }
};

export const deleteGiangVien = async (req, res) => {
    const { id } = req.params;
    try {
        const giangVien = await GiangVien.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!giangVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giảng viên'
            });
        }
        await giangVien.update({ DAXOA: true });
        return res.status(200).json({
            success: true,
            message: 'Xóa giảng viên thành công'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa giảng viên',
            error: error.message
        });
    }
};
