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
    const { MONHOC_ID, GIANGVIEN_ID, SISO_TOIDA, TRANGTHAI } = req.body;
    
    try {
        if (!MONHOC_ID) {
            return res.status(400).json({ success: false, message: 'Vui lòng chọn Môn học!' });
        }

        // Xử lý giảng viên rỗng và parse số lượng
        const giangVienId = (GIANGVIEN_ID === "" || !GIANGVIEN_ID) ? null : GIANGVIEN_ID;
        const siSoMax = SISO_TOIDA ? parseInt(SISO_TOIDA, 10) : 70;

        // 1. Gọi thẳng Stored Procedure từ Database
        const [results] = await sequelize.query(
            `EXEC [dbo].[PRO_THEM_LOPHOCPHAN] 
                @P_MONHOC_ID = :monHocId, 
                @P_GIANGVIEN_ID = :gvId, 
                @P_SISO_TOIDA = :siSoMax, 
                @P_TRANGTHAI = :trangThai`,
            {
                replacements: {
                    monHocId: MONHOC_ID,
                    gvId: giangVienId,
                    siSoMax: siSoMax,
                    trangThai: TRANGTHAI || 'Mo'
                }
            }
        );

        const spResult = results[0];

        // Xử lý các mã lỗi Database trả về
        if (spResult.StatusCode === 400) {
            return res.status(400).json({ success: false, message: spResult.Message });
        }
        if (spResult.StatusCode === 500) {
            return res.status(500).json({ success: false, message: spResult.Message });
        }

        // 2. Nếu thành công (StatusCode = 200), ta lấy NewId để query lại bản ghi vừa tạo
        const actualLopHocPhan = await LopHocPhan.findOne({
            where: { ID: spResult.NewId },
            include: [
                { model: MonHoc, attributes: ['TENMONHOC', 'SOTINCHI'] },
                { model: GiangVien, attributes: ['HOTEN', 'MAGV'] }
            ]
        });

        // 3. Trả về cho React hiển thị lên giao diện
        return res.status(201).json({
            success: true,
            message: spResult.Message,
            data: actualLopHocPhan
        });

    } catch (error) {
        console.error("=== LỖI THÊM LỚP HỌC PHẦN ===", error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống trong quá trình xử lý',
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