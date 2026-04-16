import { LopHocPhan } from "../models/index.js";

export const getAllLopHocPhan = async (req, res) => {
    try{
        const lopHocPhans= await LopHocPhan.findAll({where:{ isDelete:false }});
        return res.status(200).json({
            success: true,
            data: lopHocPhans
        })
    }
    catch(error){
        return res.status(501).json({
            success: false,
            message: "lỗi khi lấy danh sách lớp học phần",
            error: error.message
        })
    }
};

export const getLopHocPhanById = async (req, res) =>{
    const {id} =req.params;
    try {
        const lopHocPhan= await LopHocPhan.findAll({where:{ Id:id, isDelete: false }});
        if(!lopHocPhan){
            return res.status(404).json({
                success: false,
                message
            })
        }
    } catch (error) {
        
    }
} 