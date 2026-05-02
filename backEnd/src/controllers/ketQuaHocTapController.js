import { KetQuaHocTap, SinhVien, LopHocPhan, MonHoc,sequelize } from "../models/index.js";

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

export const updateDiemSinhVien = async (req, res) => {
    // Chỉ lấy các tham số đầu vào cần thiết cho SP
    const { SINHVIEN_ID, LOPHOCPHAN_ID, DIEMCHUYENCAN, DIEMGIUAKY, DIEMCUOIKY } = req.body;

    try {
        // Thực thi Stored Procedure bằng Raw Query
        const [results] = await sequelize.query(
            `EXEC [dbo].[PRO_NHAP_DIEM] 
                @P_SINHVIEN_ID = :sinhVienId, 
                @P_LOPHOCPHAN_ID = :lopHocPhanId, 
                @P_DIEM_CC = :diemCC, 
                @P_DIEM_GK = :diemGK, 
                @P_DIEM_CK = :diemCK`,
            {
                replacements: {
                    sinhVienId: SINHVIEN_ID,
                    lopHocPhanId: LOPHOCPHAN_ID,
                    diemCC: DIEMCHUYENCAN,
                    diemGK: DIEMGIUAKY,
                    diemCK: DIEMCUOIKY
                }
            }
        );

        // SP của bạn trả về bảng qua lệnh SELECT (StatusCode, Message)
        // Trong Sequelize, kết quả trả về của SELECT qua SP sẽ nằm ở phần tử đầu tiên
        const spResult = results[0];

        // Dựa vào StatusCode từ Database gửi lên để trả về HTTP Status tương ứng
        if (spResult.StatusCode === 200) {
            return res.status(200).json({
                success: true,
                message: spResult.Message
            });
        } 
        
        if (spResult.StatusCode === 404) {
            return res.status(404).json({
                success: false,
                message: spResult.Message
            });
        }

        // Trường hợp lỗi 500 do khối CATCH trong SQL bắt được
        return res.status(500).json({
            success: false,
            message: spResult.Message
        });

    } catch (error) {
        // Bắt lỗi trong trường hợp không gọi được Database (sai tên SP, mất kết nối, v.v.)
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi gọi Stored Procedure',
            error: error.message
        });
    }
};
export const dangKyMonHoc = async (req, res) => {
    // Lấy ID sinh viên và ID lớp học phần từ request body
    const { SINHVIEN_ID, LOPHOCPHAN_ID } = req.body;

    // Kiểm tra nhanh dữ liệu đầu vào
    if (!SINHVIEN_ID || !LOPHOCPHAN_ID) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng cung cấp đầy đủ mã sinh viên và mã lớp học phần!'
        });
    }

    try {
        // Gọi Stored Procedure xử lý logic đăng ký
        const [results] = await sequelize.query(
            `EXEC [dbo].[PRO_DANGKY_HOCPHAN] 
                @P_SINHVIEN_ID = :sinhVienId, 
                @P_LOPHOCPHAN_ID = :lopHocPhanId`,
            {
                replacements: {
                    sinhVienId: SINHVIEN_ID,
                    lopHocPhanId: LOPHOCPHAN_ID
                }
            }
        );

        // Kết quả từ SP (StatusCode và Message) luôn nằm ở bản ghi đầu tiên
        const spResult = results[0];

        // Thành công (lọt qua được Trigger, insert hoàn tất)
        if (spResult.StatusCode === 200) {
            return res.status(200).json({
                success: true,
                message: spResult.Message
            });
        } 
        
        // Thất bại do vi phạm nghiệp vụ (đã đăng ký rồi, hoặc bị Trigger ném lỗi: đầy lớp, môn tiên quyết...)
        if (spResult.StatusCode === 400) {
            return res.status(400).json({
                success: false,
                message: spResult.Message
            });
        }

    } catch (error) {
        // Bắt lỗi hệ thống (ví dụ: mất kết nối DB, sai tên cột...)
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống trong quá trình đăng ký học phần',
            error: error.message
        });
    }
};


