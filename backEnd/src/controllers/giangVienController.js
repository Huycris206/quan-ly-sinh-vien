import { GiangVien, TaiKhoan } from "../models/index.js";

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
    const {
        MAGV,
        HOTEN,
        GIOITINH,
        NGAYSINH,
        CCCD,
        SDT,
        TAIKHOAN_ID
    } = req.body;
    try {
        // Kiểm tra tài khoản tồn tại
        if (TAIKHOAN_ID) {
            const taiKhoan = await TaiKhoan.findOne({
                where: { ID: TAIKHOAN_ID }
            });
            if (!taiKhoan) {
                return res.status(404).json({
                    success: false,
                    message: 'Tài khoản không tồn tại!'
                });
            }
        }

        const newGiangVien = await GiangVien.create({
            MAGV,
            HOTEN,
            GIOITINH,
            NGAYSINH,
            CCCD,
            SDT,
            TAIKHOAN_ID
        });
        return res.status(201).json({
            success: true,
            message: 'Tạo giảng viên thành công',
            data: newGiangVien
        });
    } catch (error) {
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
