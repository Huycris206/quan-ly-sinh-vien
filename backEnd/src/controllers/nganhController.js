import { Nganh } from "../models/index.js";

export const getAllNganh = async (req, res) => {
    try {
        const nganh = await Nganh.findAll({ where: { IsDeleted: false } });
        return res.status(200).json({
            success: true,
            data: nganh
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
        const nganh = await Nganh.findOne({ where: { Id: id, IsDeleted: false } });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin ngành',
            error: error.message
        });
    }
};

export const updateNganh = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const nganh = await Nganh.findOne({ where: { Id: id, IsDeleted: false } });
        if (!nganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy ngành!'
            });
        }
        // Thực hiện cập nhật (chỉ cập nhật những trường được gửi lên)
        await nganh.update({
            ...updateData, // Cập nhật các trường từ body gửi lên
   
        });
        return res.status(200).json({
            success: true,
            message: 'Cập nhật ngành thành công!',
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
        const nganh = await Nganh.findOne({ where: { Id: id, IsDeleted: false } });
        if (!nganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy ngành!'
            });
        }
        nganh.IsDeleted = true;
        await nganh.save();
        return res.status(200).json({
            success: true,
            message: 'Ngành đã được xóa (Soft Delete)'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa ngành',
            error: error.message
        });
    }
};
export const createNganh = async (req, res) => {
    const { Name } = req.body;
    try {
        const newNganh = await Nganh.create({ Name });
        return res.status(201).json({
            success: true,
            message: 'Ngành đã được tạo thành công!',
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
