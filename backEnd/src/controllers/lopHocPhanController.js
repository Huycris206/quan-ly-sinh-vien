import { LopHocPhan, MonHoc, GiangVien ,sequelize} from "../models/index.js";

export const getAllLopHocPhan = async (req, res) => {
    try {
        const lopHocPhanList = await LopHocPhan.findAll({ 
            where: { DAXOA: false },
            // Nên include thêm thông tin Môn học và Giảng viên để frontend dễ hiển thị
            include: [
                { model: MonHoc, attributes: ['TENMONHOC', 'SOTINCHI'] },
                { model: GiangVien, attributes: ['HOTEN'] }
            ]
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
                { model: GiangVien, attributes: ['HOTEN'] }
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
    try {
        const { MONHOC_ID, GIANGVIEN_ID, SISO_TOIDA, TRANGTHAI } = req.body;

        if (!MONHOC_ID) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng chọn Môn học cho lớp này!' 
            });
        }

        // 1. Gọi SP thêm Lớp học phần
        const [resultSP] = await sequelize.query(
            `EXEC [dbo].[PRO_THEM_LOPHOCPHAN] 
                @P_MONHOC_ID = :monhoc_id,
                @P_GIANGVIEN_ID = :giangvien_id,
                @P_SISO_TOIDA = :siso,
                @P_TRANGTHAI = :trangthai`,
            {
                replacements: {
                    monhoc_id: MONHOC_ID,
                    giangvien_id: GIANGVIEN_ID || null, // Nếu rỗng thì truyền null
                    siso: SISO_TOIDA || 70,             // Mặc định 70 nếu client không gửi
                    trangthai: TRANGTHAI || 'Mo'        // Mặc định 'Mo'
                }
            }
        );

        const spResponse = resultSP[0];

        // 2. Xử lý lỗi (Môn học không tồn tại...)
        if (spResponse && spResponse.StatusCode === 400) {
            return res.status(400).json({
                success: false,
                message: spResponse.Message
            });
        }

        if (spResponse && spResponse.StatusCode === 500) {
            throw new Error(spResponse.Message);
        }

        // 3. Tìm lại dòng dữ liệu bằng cái NewId mà SP trả về
        const newClassId = spResponse.NewId;

        const newLopHocPhan = await LopHocPhan.findOne({
            where: { ID: newClassId, DAXOA: false },
            include: [
                { model: MonHoc, attributes: ['TENMONHOC', 'SOTINCHI'] },
                { model: GiangVien, attributes: ['MAGV', 'HOTEN'] }
            ]
        });

        // Trả về Frontend. Lúc này Frontend sẽ nhận được MALOP xịn (VD: LHP260001) 
        // và HOCKY xịn (VD: HK-2-2026) do Trigger vừa tính toán.
        return res.status(201).json({
            success: true,
            message: spResponse.Message,
            data: newLopHocPhan
        });

    } catch (error) {
        console.error("=== LỖI THÊM LỚP HỌC PHẦN ===", error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi thêm lớp học phần',
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