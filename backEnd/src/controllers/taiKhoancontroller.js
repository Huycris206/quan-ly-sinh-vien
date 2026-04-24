
import { TaiKhoan, SinhVien, sequelize } from "../models/index.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await TaiKhoan.findAll({
            where: { DAXOA: false }
        });
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách người dùng',
            error: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await TaiKhoan.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!'
            });
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin người dùng',
            error: error.message
        });
    }
};

export const createUser = async (req, res) => {
    const { TENDANGNHAP, MATKHAU, VAITRO, MASV, HOTEN } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const newUser = await TaiKhoan.create({
            TENDANGNHAP,
            MATKHAU: MATKHAU || '0',
            VAITRO
        }, { transaction });

        let newSinhVien = null;
        if (newUser.VAITRO === 'sinhvien') {
            newSinhVien = await SinhVien.create({
                TAIKHOAN_ID: newUser.ID,
                MASV: MASV || TENDANGNHAP,
                HOTEN: HOTEN || 'Chưa cập nhật'
            }, { transaction });
        }

        await transaction.commit();

        const userResponse = newUser.toJSON();
        delete userResponse.MATKHAU;
        return res.status(201).json({
            success: true,
            message: 'Thêm người dùng thành công',
            data: {
                ...userResponse,
                SinhVienProfile: newSinhVien ? newSinhVien.toJSON() : null
            }
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm người dùng',
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const user = await TaiKhoan.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!'
            });
        }
        await user.update(updateData);
        return res.status(200).json({
            success: true,
            message: 'Cập nhật người dùng thành công',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật người dùng',
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await TaiKhoan.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!'
            });
        }
        await user.update({ DAXOA: true });
        return res.status(200).json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa người dùng',
            error: error.message
        });
    }
};  