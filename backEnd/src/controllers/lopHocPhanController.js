import { LopHocPhan, MonHoc, GiangVien, sequelize } from "../models/index.js";

export const getAllLopHocPhan = async (req, res) => {
    try {
        const lopHocPhanList = await LopHocPhan.findAll({ 
            where: { DAXOA: false },
            include: [
                { model: MonHoc, attributes: ['TENMONHOC', 'SOTINCHI'] },
                { model: GiangVien, attributes: ['HOTEN', 'MAGV'] }
            ],
            order: [['NGAYTAO', 'DESC']] // Sắp xếp lớp mới tạo lên đầu
        });

        return res.status(200).json({
            success: true,
            data: lopHocPhanList
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: 'Lỗi khi lấy danh sách lớp học phần',
            error: error.message
        });
    }   
};

export const getLopHocPhanById = async (req, res) => {
    const { id } = req.params;
    try {
        const lopHocPhan = await LopHocPhan.findOne({ 
            where: { ID: id, DAXOA: false },
            include: [
                { model: MonHoc, attributes: ['TENMONHOC', 'SOTINCHI'] },
                { model: GiangVien, attributes: ['HOTEN', 'MAGV'] }
            ]
        });

        if (!lopHocPhan) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lớp học phần!'
            });
        }

        return res.status(200).json({
            success: true,
            data: lopHocPhan
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin lớp học phần',
            error: error.message
        });
    } 
};

export const createLopHocPhan = async (req, res) => { 
    // KHÔNG CẦN NHẬN MALOP VÀ HOCKY TỪ BODY NỮA VÌ ĐÃ CÓ TRIGGER LO
    const { MONHOC_ID, GIANGVIEN_ID, SISO_TOIDA, TRANGTHAI } = req.body;
    
    try {
        // Kiểm tra bắt buộc phải chọn môn học
        if (!MONHOC_ID) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn Môn học!'
            });
        }

        // 1. Tạo Lớp học phần với MALOP và HOCKY giả (để vượt qua validation của Model Sequelize)
        // Trigger dưới Database sẽ NGAY LẬP TỨC ghi đè 2 giá trị này.
        const createdLop = await LopHocPhan.create({ 
            MALOP: 'AUTO-GEN', 
            HOCKY: 'AUTO-GEN', 
            MONHOC_ID, 
            GIANGVIEN_ID: GIANGVIEN_ID || null, 
            SISO_TOIDA: SISO_TOIDA || 70, 
            TRANGTHAI: TRANGTHAI || 'Mo'
        });

        // 2. TÌM LẠI BẢN GHI VỪA TẠO (Bắt buộc)
        // Vì Trigger tự sinh Mã Lớp và Học kỳ nên ta phải query lại DB để lấy data chính xác nhất.
        const actualLopHocPhan = await LopHocPhan.findOne({
            where: { ID: createdLop.ID },
            include: [
                { model: MonHoc, attributes: ['TENMONHOC', 'SOTINCHI'] },
                { model: GiangVien, attributes: ['HOTEN', 'MAGV'] }
            ]
        });

        return res.status(201).json({
            success: true,
            message: 'Tạo Lớp học phần thành công!',
            data: actualLopHocPhan
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
    // Tách riêng các trường cho phép cập nhật (Không cho phép người dùng sửa MALOP và HOCKY)
    const { MONHOC_ID, GIANGVIEN_ID, SISO_TOIDA, TRANGTHAI } = req.body; 
    
    try {
        const lopHocPhan = await LopHocPhan.findOne({ where: { ID: id, DAXOA: false } });
        
        if (!lopHocPhan) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy Lớp học phần!'
            });
        }
       
        // Chỉ update những trường cần thiết
        await lopHocPhan.update({
            ...(MONHOC_ID && { MONHOC_ID }),
            ...(GIANGVIEN_ID !== undefined && { GIANGVIEN_ID }),
            ...(SISO_TOIDA && { SISO_TOIDA }),
            ...(TRANGTHAI && { TRANGTHAI })
        });

        // Fetch lại data kèm thông tin Môn và Giảng viên để front-end hiển thị đồng bộ
        const updatedLopHocPhan = await LopHocPhan.findOne({
            where: { ID: id },
            include: [
                { model: MonHoc, attributes: ['TENMONHOC', 'SOTINCHI'] },
                { model: GiangVien, attributes: ['HOTEN', 'MAGV'] }
            ]
        });

        return res.status(200).json({
            success: true,  
            message: 'Cập nhật Lớp học phần thành công',
            data: updatedLopHocPhan
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật Lớp học phần',
            error: error.message
        });
    }
};

export const deleteLopHocPhan = async (req, res) => {
    const { id } = req.params;
    try {
        const lopHocPhan = await LopHocPhan.findOne({ where: { ID: id, DAXOA: false } });
        
        if (!lopHocPhan) {    
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy Lớp học phần!'
            });
        }

        lopHocPhan.DAXOA = true;
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

export const getSinhVienByLopView = async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await sequelize.query(
            `SELECT * FROM [dbo].[View_DanhSachSinhVien_TheoLop] 
             WHERE LOPHOCPHAN_ID = :idLop`,
            {
                replacements: { idLop: id }
            }
        );

        if (!results || results.length === 0) {
            return res.status(200).json({ 
                success: true,
                message: 'Lớp này chưa có sinh viên nào đăng ký.',
                data: [] // Trả về mảng rỗng thay vì báo lỗi
            });
        }

        return res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sinh viên từ View',
            error: error.message
        });
    }
};