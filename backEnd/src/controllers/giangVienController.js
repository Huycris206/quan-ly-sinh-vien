import { GiangVien } from "../models/index.js";

export const getAllGiangVien = async (req, res) => {
    try{
        const giangViens= await GiangVien.findAll({where:{ IsDeleted:false }});
        return res.status(200).json({
            success: true,
            data: giangViens
        })
    }
    catch(error){
        return res.status(501).json({
            success: false,
            message: "lỗi khi lấy danh sách giảng viên",
            error: error.message
        })
    }
};

export const getGiangVienById = async (req, res) =>{
    const {id} =req.params;
    try {
        const giangVien= await GiangVien.findOne({where:{ Id:id, IsDeleted: false }});
        if(!giangVien){
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy giảng viên"
            })
        }
        return res.status(200).json({
            success: true,
            data: giangVien
        })
    }
    catch (error) {
        return res.status(501).json({
            success: false,
            message: "lỗi khi lấy thông tin giảng viên",
            error: error.message
        })
    }
};

export const createGiangVien = async (req, res) => {
    const { UserId, Teacher_id, Full_name, Gender, Birthday, Phone } = req.body;
    try {
        const newGiangVien = await GiangVien.create({
            UserId,
            Teacher_id,
            Full_name,
            Gender,
            Birthday,
            Phone
        });
        return res.status(201).json({
            success: true,
            data: newGiangVien
        });
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: "lỗi khi tạo giảng viên mới",
            error: error.message
        });
    }
};

export const updateGiangVien = async (req, res) => {
    const { id } = req.params;
    const { UserId, Teacher_id, Full_name, Gender, Birthday, Phone } = req.body;
    try {
        const giangVien = await GiangVien.findOne({ where: { Id: id, IsDeleted: false } }); 
        if (!giangVien) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy giảng viên"
            });
        }
        giangVien.UserId = UserId || giangVien.UserId;
        giangVien.Teacher_id = Teacher_id || giangVien.Teacher_id;
        giangVien.Full_name = Full_name || giangVien.Full_name;
        giangVien.Gender = Gender || giangVien.Gender;
        giangVien.Birthday = Birthday || giangVien.Birthday;
        giangVien.Phone = Phone || giangVien.Phone;
        await giangVien.save();
        return res.status(200).json({
            success: true,
            data: giangVien
        });
    } catch (error) {
        return res.status(501).json({
            success: false, 
            message: "lỗi khi cập nhật thông tin giảng viên",
            error: error.message
        });
    }   
};

export const deleteGiangVien = async (req, res) => {
    const { id } = req.params;
    try {
        const giangVien = await GiangVien.findOne({ where: { Id: id, IsDeleted: false } });
        if (!giangVien) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy giảng viên"
            });
        }
        giangVien.IsDeleted = true;
        await giangVien.save();
        return res.status(200).json({
            success: true,
            message: "Giảng viên đã được xóa (đánh dấu IsDeleted)"
        });
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: "lỗi khi xóa giảng viên",
            error: error.message
        });
    }
};
