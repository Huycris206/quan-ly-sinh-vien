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
    const { LOPHOCPHAN_ID, THU, TIET_BATDAU, TIET_KETTHUC, PHONGHOC } = req.body;
    try {
        const newLichHoc = await LichHoc.create({
            LOPHOCPHAN_ID,
            THU,
            TIET_BATDAU,
            TIET_KETTHUC,
            PHONGHOC
        });
        return res.status(201).json({
            success: true,
            message: 'Tạo lịch học thành công',
            data: newLichHoc
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo lịch học',
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