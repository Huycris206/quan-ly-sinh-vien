import { MonHoc } from "../models/index.js";

export const getAllMonHoc = async (req, res) => {
    try {
        const monHocs = await MonHoc.findAll({
            where: { DAXOA: false }
        });
        return res.status(200).json({
            success: true,
            data: monHocs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách môn học',
            error: error.message
        });
    }
};

export const getMonHocById = async (req, res) => {
    const { id } = req.params;
    try {
        const monHoc = await MonHoc.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!monHoc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy môn học!'
            });
        }
        return res.status(200).json({
            success: true,
            data: monHoc
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy môn học',
            error: error.message
        });
    }
};

export const createMonHoc = async (req, res) => {
    const { TENMONHOC, SOTINCHI } = req.body;
    try {
        const newMonHoc = await MonHoc.create({
            TENMONHOC,
            SOTINCHI
        });
        return res.status(201).json({
            success: true,
            message: 'Tạo môn học thành công',
            data: newMonHoc
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Tạo môn học không thành công',
            error: error.message
        });
    }
};

export const updateMonHoc = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const monHoc = await MonHoc.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!monHoc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy môn học!'
            });
        }
        await monHoc.update(updateData);
        return res.status(200).json({
            success: true,
            message: 'Cập nhật môn học thành công',
            data: monHoc
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật môn học',
            error: error.message
        });
    }
};

export const deleteMonHoc = async (req, res) => {
    const { id } = req.params;
    try {
        const monHoc = await MonHoc.findOne({
            where: { ID: id, DAXOA: false }
        });
        if (!monHoc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy môn học!'
            });
        }
        await monHoc.update({ DAXOA: true });
        return res.status(200).json({
            success: true,
            message: 'Xóa môn học thành công'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa môn học',
            error: error.message
        });
    }
};
