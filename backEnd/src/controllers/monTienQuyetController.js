import { MonTienQuyet, MonHoc } from "../models/index.js";

export const getMonTienQuyetByMonHoc = async (req, res) => {
    const { monHocId } = req.params;
    try {
        const monTienQuyetList = await MonTienQuyet.findAll({
            where: { MONHOC_ID: monHocId },
            include: [{
                model: MonHoc,
                as: 'MonHocTruoc',
                attributes: ['TENMONHOC']
            }]
        });
        return res.status(200).json({
            success: true,
            data: monTienQuyetList
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách môn tiên quyết',
            error: error.message
        });
    }
};

export const addMonTienQuyet = async (req, res) => {
    const { MONHOC_ID, MONHOC_TRUOC_ID, LOAIDIEUKIEN } = req.body;
    try {
        const existing = await MonTienQuyet.findOne({
            where: { MONHOC_ID, MONHOC_TRUOC_ID }
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Môn tiên quyết này đã tồn tại!'
            });
        }
        const newMonTienQuyet = await MonTienQuyet.create({
            MONHOC_ID,
            MONHOC_TRUOC_ID,
            LOAIDIEUKIEN: LOAIDIEUKIEN || 'TienQuyet'
        });
        return res.status(201).json({
            success: true,
            message: 'Thêm môn tiên quyết thành công',
            data: newMonTienQuyet
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm môn tiên quyết',
            error: error.message
        });
    }
};

export const removeMonTienQuyet = async (req, res) => {
    const { MONHOC_ID, MONHOC_TRUOC_ID } = req.body;
    try {
        const monTienQuyet = await MonTienQuyet.findOne({
            where: { MONHOC_ID, MONHOC_TRUOC_ID }
        });
        if (!monTienQuyet) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy môn tiên quyết!'
            });
        }
        await monTienQuyet.destroy();
        return res.status(200).json({
            success: true,
            message: 'Xóa môn tiên quyết thành công'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa môn tiên quyết',
            error: error.message
        });
    }
};