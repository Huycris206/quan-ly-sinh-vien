import { KetQuaHocTap, SinhVien, LopHocPhan, MonHoc, sequelize } from "../models/index.js";

export const getDiemByLopHocPhan = async (req, res) => {
    const { lopHocPhanId } = req.params;
    try {
        const danhSachDiem = await KetQuaHocTap.findAll({
            where: { LOPHOCPHAN_ID: lopHocPhanId },
            include: [{
                model: SinhVien,
                attributes: ['MASV', 'HOTEN']
            }]
        });
        return res.status(200).json({ success: true, data: danhSachDiem });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy bảng điểm', error: error.message });
    }
};
export const getAllKetQuaHocTap = async (req, res) => {
    try {
        const ketQuaHocTapList = await KetQuaHocTap.findAll({
            include: [{
                model: SinhVien,
                attributes: ['MASV', 'HOTEN']
            }, {
                model: LopHocPhan,
                attributes: ['MALOP', 'HOCKY'],
                include: [{
                    model: MonHoc,
                    attributes: ['TENMONHOC', 'SOTINCHI']
                }]
            }]
        });
        return res.status(200).json({ success: true, data: ketQuaHocTapList });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy kết quả học tập', error: error.message });
    }
};

export const getBangDiemCaNhan = async (req, res) => {
    const { sinhVienId } = req.params;
    try {
        const bangDiem = await KetQuaHocTap.findAll({
            where: { SINHVIEN_ID: sinhVienId },
            include: [{
                model: LopHocPhan,
                attributes: ['MALOP', 'HOCKY'],
                include: [{
                    model: MonHoc,
                    attributes: ['TENMONHOC', 'SOTINCHI']
                }]
            }]
        });
        return res.status(200).json({ success: true, data: bangDiem });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy bảng điểm cá nhân', error: error.message });
    }
};


export const dangKyHocPhan = async (req, res) => {
    try {
        // 1. Lấy 2 ID từ Client gửi lên
        const { SINHVIEN_ID, LOPHOCPHAN_ID } = req.body;

        // Bắt lỗi cơ bản nếu Front-end gửi thiếu data
        if (!SINHVIEN_ID || !LOPHOCPHAN_ID) {
            return res.status(400).json({ 
                success: false, 
                message: 'Thiếu thông tin Sinh viên hoặc Lớp học phần!' 
            });
        }

        // 2. Gọi Stored Procedure
        const [resultSP] = await sequelize.query(
            `EXEC [dbo].[PRO_DANGKY_HOCPHAN] 
                @P_SINHVIEN_ID = :sinhvien_id, 
                @P_LOPHOCPHAN_ID = :lophocphan_id`,
            {
                replacements: {
                    sinhvien_id: SINHVIEN_ID,
                    lophocphan_id: LOPHOCPHAN_ID
                }
                // Bỏ qua type: QueryTypes.RAW để lấy thẳng mảng kết quả
            }
        );

        // 3. Đọc kết quả từ SQL Server gửi lên
        const spResponse = resultSP[0]; // Lấy dòng dữ liệu đầu tiên

        // Nếu Trigger dưới DB báo lỗi (sĩ số đầy, trùng môn, chưa học tiên quyết...)
        if (spResponse && spResponse.StatusCode === 400) {
            return res.status(400).json({
                success: false,
                message: spResponse.Message // Sẽ trả đúng câu lỗi bạn viết trong SQL
            });
        }

        // 4. Nếu thành công (StatusCode = 200)
        return res.status(200).json({
            success: true,
            message: spResponse.Message // "Đăng ký học phần thành công!"
        });

    } catch (error) {
        // Lỗi này chỉ xảy ra khi sập mạng, lỗi kết nối DB, hoặc sai tên SP
        console.error("=== LỖI HỆ THỐNG ===", error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi đăng ký học phần',
            error: error.message
        });
    }
};
export const nhapDiemHocPhan = async (req, res) => {
    try {
        const { SINHVIEN_ID, LOPHOCPHAN_ID, DIEMCHUYENCAN=null, DIEMGIUAKY=null, DIEMCUOIKY=null } = req.body;   
        if (!SINHVIEN_ID || !LOPHOCPHAN_ID) {
            return res.status(400).json({ 
                success: false,
                message: 'Thiếu thông tin Sinh viên hoặc Lớp học phần!'
            });
        }
        const [resultSP] = await sequelize.query(
            `EXEC [dbo].[PRO_NHAP_DIEM] 
                @P_SINHVIEN_ID = :sinhvien_id,
                @P_LOPHOCPHAN_ID = :lophocphan_id,
                @P_DIEM_CC = :diemchuyencan,  
                @P_DIEM_GK = :diemgiuaky,     
                @P_DIEM_CK = :diemcuoiky`,    
            {
                replacements: {
                    sinhvien_id: SINHVIEN_ID,
                    lophocphan_id: LOPHOCPHAN_ID,
                    diemchuyencan: DIEMCHUYENCAN, 
                    diemgiuaky: DIEMGIUAKY,
                    diemcuoiky: DIEMCUOIKY
                }
            }
        );
        
        const spResponse = resultSP[0];
        if (spResponse && spResponse.StatusCode === 400) {
            return res.status(400).json({
                success: false,
                message: spResponse.Message
            });
        }
        return res.status(200).json({
            success: true,
            message: spResponse.Message
        });
    } catch (error) {        
        console.error("=== LỖI HỆ THỐNG ===", error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi nhập điểm học phần',
            error: error.message
        });
    }
};