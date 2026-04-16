
import {User,SinhVien} from "../models/index.js";


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ where: { IsDeleted: false } });
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: 'Lỗi khi lấy danh sách người dùng',
            error: error.message
        });
    }   
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ where: { Id: id, IsDeleted: false } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!'
            });
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin người dùng',
            error: error.message
        });
    } 
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ where: { Id: id, IsDeleted: false } });
        if (!user) {    
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!'
            });
        }
        user.IsDeleted = true;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Người dùng đã được xóa (Soft Delete)'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa người dùng',
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
     console.log("=== DỮ LIỆU TỪ CLIENT GỬI LÊN ===", updateData)
    try {
        const user = await User.findOne({ where: { Id: id, IsDeleted: false } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!'
            });
        }
       
        await user.update({
                ...updateData,
                 // Cập nhật thời gian sửa đổi
            },{
                
                logging: console.log
            }
        );
        return res.status(200).json({
            success: true,  
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật người dùng',
            error: error.message,
            data: updateData
        });
    }
};

export const createUser = async (req, res) => { 
    const { Username, Password , Role, Student_id, Full_name } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const newUser = await User.create({ Username, Password_hash: Password || '0', Role 
        }, { transaction});
        let newSinhVien = null;

        // 2. Nếu Role là 'student', tự động tạo profile rỗng bên bảng SinhVien
        if (newUser.Role === 'student') {
            newSinhVien = await SinhVien.create({
                UserId: newUser.Id,
                Student_id: Student_id || Username, // Nếu không truyền mã SV thì lấy Username làm mã
                Full_name: Full_name || 'Chưa cập nhật'
            }, { transaction });
        }

        // 3. Commit thành công
        await transaction.commit();

        // Xóa thông tin nhạy cảm trước khi trả về
        const userResponse = newUser.toJSON();
        delete userResponse.Password_hash;
        return res.status(201).json({
            success: true,
            message: 'Thêm người dùng thành công!',
            data: {
                ...userResponse,
                SinhVienProfile: newSinhVien ? newSinhVien.toJSON() : null
            }
        });
    } catch (error) {
        await transaction.rollback()
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm người dùng',
            error: error.message
        });
    }
};  