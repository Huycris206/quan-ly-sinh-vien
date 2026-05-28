import { LichHoc, LopHocPhan } from "../models/index.js";

export const getAllLichHoc = async (req, res) => {
    try {
        const lichHocList = await LichHoc.findAll({
            include: [{
                model: LopHocPhan,
                attributes: ['MALOP']
            }]
        });
        return res.status(200).json({
            success: true,
            data: lichHocList
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách lịch học',
            error: error.message
        });
    }
};

export const getLichHocById = async (req, res) => {
    const { id } = req.params;
    try {
        const lichHoc = await LichHoc.findOne({
            where: { ID: id },
            include: [{
                model: LopHocPhan,
                attributes: ['MALOP']
            }]
        });
        if (!lichHoc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch học!'
            });
        }
        return res.status(200).json({
            success: true,
            data: lichHoc
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin lịch học',
            error: error.message
        });
    }
};

export const createLichHoc = async (req, res) => {
    try {
        const { LOPHOCPHAN_ID, THU, TIET_BATDAU, TIET_KETTHUC, PHONGHOC } = req.body;

        // Kiểm tra đầu vào cơ bản
        if (!LOPHOCPHAN_ID || !THU || !TIET_BATDAU || !TIET_KETTHUC || !PHONGHOC) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin lịch học!'
            });
        }

        // Gọi Stored Procedure
        const [resultSP] = await sequelize.query(
            `EXEC [dbo].[PRO_THEM_LICHHOC] 
                @P_LOPHOCPHAN_ID = :lhp_id,
                @P_THU = :thu,
                @P_TIET_BATDAU = :tbd,
                @P_TIET_KETTHUC = :tkt,
                @P_PHONGHOC = :phong`,
            {
                replacements: {
                    lhp_id: LOPHOCPHAN_ID,
                    thu: THU,
                    tbd: TIET_BATDAU,
                    tkt: TIET_KETTHUC,
                    phong: PHONGHOC
                }
            }
        );

        const spResponse = resultSP[0];

        // Xử lý lỗi nghiệp vụ từ SQL (Trùng lịch, sai dữ liệu)
        if (spResponse && spResponse.StatusCode === 400) {
            return res.status(400).json({
                success: false,
                message: spResponse.Message
            });
        }

        // Xử lý lỗi hệ thống từ SQL
        if (spResponse && spResponse.StatusCode === 500) {
            throw new Error(spResponse.Message);
        }

        // Lấy lại dữ liệu vừa tạo để trả về (Kèm thông tin lớp học phần)
        const newLichHoc = await LichHoc.findOne({
            where: { 
                LOPHOCPHAN_ID: LOPHOCPHAN_ID, 
                THU: THU, 
                TIET_BATDAU: TIET_BATDAU,
                PHONGHOC: PHONGHOC 
            },
            include: [{ model: LopHocPhan }]
        });

        return res.status(201).json({
            success: true,
            message: spResponse.Message,
            data: newLichHoc
        });

    } catch (error) {
        console.error("=== LỖI THÊM LỊCH HỌC ===", error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi thêm lịch học',
            error: error.message
        });
    }
};

export const updateLichHoc = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const lichHoc = await LichHoc.findOne({
            where: { ID: id }
        });
        if (!lichHoc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch học!'
            });
        }
        await lichHoc.update(updateData);
        return res.status(200).json({
            success: true,
            message: 'Cập nhật lịch học thành công',
            data: lichHoc
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật lịch học',
            error: error.message
        });
    }
};

export const deleteLichHoc = async (req, res) => {
    const { id } = req.params;
    try {
        const lichHoc = await LichHoc.findOne({
            where: { ID: id }
        });
        if (!lichHoc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch học!'
            });
        }
        await lichHoc.destroy();
        return res.status(200).json({
            success: true,
            message: 'Xóa lịch học thành công'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa lịch học',
            error: error.message
        });
    }
};