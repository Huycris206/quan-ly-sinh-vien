import { ChuyenNganh, Nganh } from "../models/index.js";

export const getAllChuyenNganh = async (req, res) => {
    try {
        const chuyenNganhList = await ChuyenNganh.findAll({ 
            where: { IsDeleted: false },
            include: [{
                model: Nganh,
                attributes: ['Name'] // Kéo theo tên của Ngành lớn
            }]
        });

        return res.status(200).json({
            success: true,
            data: chuyenNganhList
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: 'Lỗi khi lấy danh sách Chuyên ngành',
            error: error.message
        });
    }   
};

export const getChuyenNganhById = async (req, res) => {
    const { id } = req.params;
    try {
        const chuyenNganh = await ChuyenNganh.findOne({ 
            where: { Id: id, IsDeleted: false },
            include: [{ model: Nganh, attributes: ['Name'] }]
        });

        if (!chuyenNganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy Chuyên ngành!'
            });
        }

        return res.status(200).json({
            success: true,
            data: chuyenNganh
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin Chuyên ngành',
            error: error.message
        });
    } 
};

export const createChuyenNganh = async (req, res) => { 
    const { NganhId, Name } = req.body;
    
    try {
        // Có thể thêm bước kiểm tra xem NganhId có tồn tại không trước khi tạo
        const existingNganh = await Nganh.findOne({ where: { Id: NganhId, IsDeleted: false } });
        if (!existingNganh) {
            return res.status(404).json({
                success: false,
                message: 'Ngành học gốc không tồn tại!'
            });
        }

        const newChuyenNganh = await ChuyenNganh.create({ NganhId, Name });

        return res.status(201).json({
            success: true,
            message: 'Tạo Chuyên ngành thành công!',
            data: newChuyenNganh
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo Chuyên ngành',
            error: error.message
        });
    }
};  

export const updateChuyenNganh = async (req, res) => {
    const { id } = req.params;
    const { NganhId, Name } = req.body;
    
    try {
        const chuyenNganh = await ChuyenNganh.findOne({ where: { Id: id, IsDeleted: false } });
        
        if (!chuyenNganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy Chuyên ngành!'
            });
        }
       
        await chuyenNganh.update({ NganhId, Name });

        return res.status(200).json({
            success: true,  
            message: 'Cập nhật Chuyên ngành thành công',
            data: chuyenNganh
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật Chuyên ngành',
            error: error.message
        });
    }
};

export const deleteChuyenNganh = async (req, res) => {
    const { id } = req.params;
    try {
        const chuyenNganh = await ChuyenNganh.findOne({ where: { Id: id, IsDeleted: false } });
        
        if (!chuyenNganh) {    
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy Chuyên ngành!'
            });
        }

        chuyenNganh.IsDeleted = true;
        await chuyenNganh.save();

        return res.status(200).json({
            success: true,
            message: 'Chuyên ngành đã được xóa (Soft Delete)'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa Chuyên ngành',
            error: error.message
        });
    }
};