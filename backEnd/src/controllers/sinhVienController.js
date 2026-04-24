import { SinhVien, ChuyenNganh, Nganh, TaiKhoan, sequelize } from '../models/index.js';

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
                    attributes: ['USERNAME', 'ROLE']
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
                    attributes: ['USERNAME', 'ROLE']
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
    const {
        MASV,
        HOTEN,
        GIOITINH,
        NGAYSINH,
        SDT,
        EMAIL,
        CCCD,
        QUEQUAN,
        DIACHI,
        KHOAHOC,
        TRANGTHAI,
        CHUYENNGANH_ID,
        TAIKHOAN_ID
    } = req.body;

    const transaction = await sequelize.transaction();
    try {
        // Kiểm tra chuyên ngành tồn tại
        if (CHUYENNGANH_ID) {
            const chuyenNganh = await ChuyenNganh.findOne({
                where: { ID: CHUYENNGANH_ID, DAXOA: false },
                transaction
            });
            if (!chuyenNganh) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Chuyên ngành không tồn tại!'
                });
            }
        }

        // Kiểm tra tài khoản tồn tại
        if (TAIKHOAN_ID) {
            const taiKhoan = await TaiKhoan.findOne({
                where: { ID: TAIKHOAN_ID },
                transaction
            });
            if (!taiKhoan) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Tài khoản không tồn tại!'
                });
            }
        }

        const newSinhVien = await SinhVien.create({
            MASV,
            HOTEN,
            GIOITINH,
            NGAYSINH,
            SDT,
            EMAIL,
            CCCD,
            QUEQUAN,
            DIACHI,
            KHOAHOC,
            TRANGTHAI,
            CHUYENNGANH_ID,
            TAIKHOAN_ID
        }, { transaction });

        await transaction.commit();
        return res.status(201).json({
            success: true,
            message: 'Thêm sinh viên thành công',
            data: newSinhVien
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm sinh viên',
            error: error.message
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
