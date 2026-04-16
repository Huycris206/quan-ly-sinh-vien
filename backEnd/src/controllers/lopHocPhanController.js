import { LopHocPhan, MonHoc, GiangVien, sequelize } from "../models/index.js";

export const getAllLopHocPhan = async (req, res) => {
    try {
        const lopHocPhanList = await LopHocPhan.findAll({ 
            where: { IsDeleted: false },
            // Nên include thêm thông tin Môn học và Giảng viên để frontend dễ hiển thị
            include: [
                { model: MonHoc, attributes: ['Name', 'TinChi'] },
                { model: GiangVien, attributes: ['Full_name'] }
            ]
        });

        return res.status(200).json({
            success: true,
            data: lopHocPhanList
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: 'Lỗi khi lấy danh sách Lớp học phần',
            error: error.message
        });
    }   
};

export const getLopHocPhanById = async (req, res) => {
    const { id } = req.params;
    try {
        const lopHocPhan = await LopHocPhan.findOne({ 
            where: { Id: id, IsDeleted: false } 
        });

        if (!lopHocPhan) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy Lớp học phần!'
            });
        }

        return res.status(200).json({
            success: true,
            data: lopHocPhan
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin Lớp học phần',
            error: error.message
        });
    } 
};

export const createLopHocPhan = async (req, res) => { 
    const { MaLop, Teacher_id, MonHocId, HocKy, Sv_max, Status } = req.body;
    
    try {
        // Kiểm tra xem mã lớp đã tồn tại chưa (nếu nghiệp vụ yêu cầu MaLop là duy nhất)
        const existingLop = await LopHocPhan.findOne({ where: { MaLop: MaLop, IsDeleted: false } });
        if (existingLop) {
            return res.status(400).json({
                success: false,
                message: 'Mã lớp học phần đã tồn tại!'
            });
        }

        const newLopHocPhan = await LopHocPhan.create({ 
            MaLop, 
            Teacher_id, 
            MonHocId, 
            HocKy, 
            Sv_max: Sv_max || 70, 
            Status: Status || 'Mo'
        });

        return res.status(201).json({
            success: true,
            message: 'Tạo Lớp học phần thành công!',
            data: newLopHocPhan
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo Lớp học phần',
            error: error.message
        });
    }
};  

export const updateLopHocPhan = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    try {
        const lopHocPhan = await LopHocPhan.findOne({ where: { Id: id, IsDeleted: false } });
        
        if (!lopHocPhan) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy Lớp học phần!'
            });
        }
       
        await lopHocPhan.update(updateData);

        return res.status(200).json({
            success: true,  
            message: 'Cập nhật Lớp học phần thành công',
            data: lopHocPhan
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật Lớp học phần',
            error: error.message,
            data: updateData
        });
    }
};

export const deleteLopHocPhan = async (req, res) => {
    const { id } = req.params;
    try {
        const lopHocPhan = await LopHocPhan.findOne({ where: { Id: id, IsDeleted: false } });
        
        if (!lopHocPhan) {    
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy Lớp học phần!'
            });
        }

        lopHocPhan.IsDeleted = true;
        await lopHocPhan.save();

        return res.status(200).json({
            success: true,
            message: 'Lớp học phần đã được xóa (Soft Delete)'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa Lớp học phần',
            error: error.message
        });
    }
};