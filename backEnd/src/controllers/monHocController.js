import {MonHoc} from "../models/index.js";

export const getAllMonHoc = async (req, res) => {
    try {
        const monHocs = await MonHoc.findAll({ where: { IsDeleted: false } });  
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
        const monHoc =await MonHoc.findOne({ where:{ Id: id, IsDeleted: false } });
        if (!monHoc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy môn học!'
            });
        }
        return res.status(200).json({
            success:true,
            data: monHoc
        });
    } catch(error){
        return res.status(500).json({
            success:'false',
            message:'lỗi khi lấy môn học'
        })
    }
};

export const updateMonHoc =async(req, res)=>{
    const{id} =req.params;
    const updateData= req.body;
    try {
        const monHoc =await MonHoc.findOne({ where:{ Id: id, IsDeleted: false } });
        if (!monHoc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy môn học!'
            });
        }
        await monHoc.update({
           ...updateData,
        })
        return res.status(200).json({
            success: true,
            message: 'cập nhật môn học thành công',
            data: monHoc
        })
    } catch (error) {
        return res.status(501).json({
            success:false,
            message:'lỗi khi cập nhật môn học',
            error:error.message
        })
    }
};

export const deleteMonHoc =async(req, res) =>{
    const{id} =req.params;
    
        try {
            const monHoc =await MonHoc.findOne({ where:{ Id: id, IsDeleted: false } });
            if (!monHoc) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy môn học!'
                });
            }
            monHoc.IsDeleted=true;
            await monHoc.save();
            return res.status(200).json({
                success: true,
                message:'xóa thành công'
            })
        } catch (error) {
            return res.status(501).json({
                success:false,
                message:'xóa không thành công'
            })
        }
}

export const createMonHoc= async(req, res) =>{
    const {Name} =req.body;
    try {
        const newMon=await MonHoc.create({Name});
        return res.status(200).json({
            success:true,
            message:'tạo môn học thành công',
            data:newMon
        })


    } catch (error) {
        return res.status(501).json({
            success:false,
            message:'tạo môn học không thành công',
            error:error.message
        })
    }
}
