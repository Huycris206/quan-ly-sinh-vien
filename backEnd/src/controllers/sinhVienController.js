import { SinhVien, ChuyenNganh, Nganh, User } from '../models/index.js';

// 1. Lấy danh sách tất cả sinh viên (Kèm tên Chuyên Ngành)
export const getAllSinhVien = async (req, res) => {
    try {
        const danhSach = await SinhVien.findAll({
            where: { 
                IsDeleted: false // Lọc bỏ những sinh viên đã bị xóa mềm
            },
            include: [
                {
                    model: ChuyenNganh,
                    attributes: ['Name'],
                    include:[
                        {
                            model: Nganh,
                            attributes: ['Name']
                        }
                    ] // Chỉ lấy cột 'Name' của bảng ChuyenNganh để data gọn gàng
                },
                

            ]
        });

        return res.status(200).json({
            success: true,
            data: danhSach
        });
    } catch (error) {
        await transaction.rollback()
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sinh viên',
            error: error.message
        });
    }
};

// 2. Lấy thông tin chi tiết 1 sinh viên theo ID (Kèm tên Chuyên Ngành)
export const getSinhVienById = async (req, res) => {
    const { id } = req.params;

    try {
        const sinhVien = await SinhVien.findOne({
            where: { 
                Id: id,
                IsDeleted: false 
            },
            include: [
                {
                    model: ChuyenNganh,
                    attributes: ['Name'],
                    include:[
                        {
                            model: Nganh,
                            attributes: ['Name']
                        }
                    ] //
                }
            ]
        });

        if (!sinhVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên!'
            });
        }

        return res.status(200).json({
            success: true,
            data: sinhVien
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin sinh viên',
            error: error.message
        });
    }
};

// 3. Thêm mới sinh viên
export const createSinhVien = async (req, res) => {
    // Nhận dữ liệu từ request body
    const {  Student_id, Full_name, Gender, Birthday, Phone, ChuyenNganhId, TrangThai } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const newUser = await User.create({
            Username: Student_id, // Lấy mã SV làm tài khoản đăng nhập
            Password_hash: '0', // Mặc định mật khẩu là '0' (bắt buộc phải đổi khi đăng nhập lần đầu)
            Role: 'student' // Gán cứng role là sinh viên
        }, { transaction });
        const newSinhVien = await SinhVien.create({
            UserId: newUser.Id,
            Student_id,
            Full_name,
            Gender,
            Birthday,
            Phone,
            ChuyenNganhId,
            TrangThai
        }, { transaction });
        await transaction.commit();
        return res.status(201).json({
            success: true,
            message: 'Thêm sinh viên thành công!',
            data: { 
                sinhVien: newSinhVien,
                user: { Id: newUser.Id, Username: newUser.Username, Role: newUser.Role }
        }});
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm sinh viên',
            error: error.message
        });
    }
};
export const deleteSinhVien = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm sinh viên
        const sinhVien = await SinhVien.findOne({
            where: { 
                Id: id,
                IsDeleted: false 
            }
        });

        if (!sinhVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên hoặc đã bị xóa từ trước!'
            });
        }

        // Xóa mềm: Chuyển IsDeleted thành true thay vì xóa vĩnh viễn (Hard delete)
        await sinhVien.update({ IsDeleted: true });

        return res.status(200).json({
            success: true,
            message: 'Đã xóa sinh viên thành công!'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa sinh viên',
            error: error.message
        });
    }
};
export const updateSinhVien = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID sinh viên từ URL
        const updateData = req.body; // Lấy dữ liệu cần sửa

        // Tìm sinh viên xem có tồn tại không
        const sinhVien = await SinhVien.findOne({
            where: { 
                Id: id,
                IsDeleted: false 
            },
            
        });

        if (!sinhVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên!'
            });
        }

        // Thực hiện cập nhật (chỉ cập nhật những trường được gửi lên)
        await sinhVien.update({
                ...updateData, // Cập nhật các trường từ body gửi lên
                 // Dùng ngày giờ của SQL Server
            },
            {
               // Bắt buộc phải có dòng này để Sequelize không chèn ngày tháng lỗi vào
            });

        return res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin sinh viên thành công!',
            data: sinhVien
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật sinh viên',
            error: error.message
        });
    }
};
