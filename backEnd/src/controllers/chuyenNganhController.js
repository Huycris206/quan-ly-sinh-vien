import { ChuyenNganh, Nganh } from "../models/index.js";

export const getAllChuyenNganh = async (req, res) => {
    try {
        const chuyenNganhList = await ChuyenNganh.findAll({
            where: { DAXOA: false },
            include: [{
                model: Nganh,
                attributes: ['TENNGANH']
            }]
        });
        return res.status(200).json({
            success: true,
            data: chuyenNganhList
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách chuyên ngành',
            error: error.message
        });
    }
};

export const getChuyenNganhById = async (req, res) => {
    const { id } = req.params;
    try {
        const chuyenNganh = await ChuyenNganh.findOne({
            where: { ID: id, DAXOA: false },
            include: [{
                model: Nganh,
                attributes: ['TENNGANH']
            }]
        });
        if (!chuyenNganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chuyên ngành!'
            });
        }
        return res.status(200).json({
            success: true,
            data: chuyenNganh
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin chuyên ngành',
            error: error.message
        });
    }
};

export const createChuyenNganh = async (req, res) => {
    const { NGANH_ID, TENCHUYENNGANH } = req.body;
    try {
        const existingNganh = await Nganh.findOne({
            where: { ID: NGANH_ID, DAXOA: false }
        });
        if (!existingNganh) {
            return res.status(404).json({
                success: false,
                message: 'Ngành học gốc không tồn tại!'
            });
        }
        const newChuyenNganh = await ChuyenNganh.create({
            NGANH_ID,
            TENCHUYENNGANH
        });
        return res.status(201).json({
            success: true,
            message: 'Tạo chuyên ngành thành công',
            data: newChuyenNganh
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo chuyên ngành',
            error: error.message
        });
    }
};

export const updateChuyenNganh = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const chuyenNganh = await ChuyenNganh.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!chuyenNganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chuyên ngành!'
            });
        }
        await chuyenNganh.update(updateData);
        return res.status(200).json({
            success: true,
            message: 'Cập nhật chuyên ngành thành công',
            data: chuyenNganh
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật chuyên ngành',
            error: error.message
        });
    }
};

export const deleteChuyenNganh = async (req, res) => {
    const { id } = req.params;
    try {
        const chuyenNganh = await ChuyenNganh.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!chuyenNganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chuyên ngành!'
            });
        }
        await chuyenNganh.update({ DAXOA: true });
        return res.status(200).json({
            success: true,
            message: 'Xóa chuyên ngành thành công'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa chuyên ngành',
            error: error.message
        });
    }
};