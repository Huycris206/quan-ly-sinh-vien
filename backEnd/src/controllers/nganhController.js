import { Nganh } from "../models/index.js";

export const getAllNganh = async (req, res) => {
    try {
        const nganhs = await Nganh.findAll({
            where: { DAXOA: false }
        });
        return res.status(200).json({
            success: true,
            data: nganhs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách ngành',
            error: error.message
        });
    }
};

export const getNganhById = async (req, res) => {
    const { id } = req.params;
    try {
        const nganh = await Nganh.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!nganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy ngành!'
            });
        }
        return res.status(200).json({
            success: true,
            data: nganh
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin ngành',
            error: error.message
        });
    }
};

export const createNganh = async (req, res) => {
    const { TENNGANH } = req.body;
    try {
        const newNganh = await Nganh.create({
            TENNGANH
        });
        return res.status(201).json({
            success: true,
            message: 'Tạo ngành thành công',
            data: newNganh
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo ngành',
            error: error.message
        });
    }
};

export const updateNganh = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const nganh = await Nganh.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!nganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy ngành!'
            });
        }
        await nganh.update(updateData);
        return res.status(200).json({
            success: true,
            message: 'Cập nhật ngành thành công',
            data: nganh
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật ngành',
            error: error.message
        });
    }
};

export const deleteNganh = async (req, res) => {
    const { id } = req.params;
    try {
        const nganh = await Nganh.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!nganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy ngành!'
            });
        }
        await nganh.update({ DAXOA: true });
        return res.status(200).json({
            success: true,
            message: 'Xóa ngành thành công'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa ngành',
            error: error.message
        });
    }
};
