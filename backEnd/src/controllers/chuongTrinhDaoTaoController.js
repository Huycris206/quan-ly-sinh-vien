import { ChuongTrinhDaoTao, ChuyenNganh, MonHoc } from "../models/index.js";

export const getKhungChuongTrinh = async (req, res) => {
    const { chuyenNganhId } = req.params;
    try {
        const khungDaoTao = await ChuongTrinhDaoTao.findAll({
            where: { CHUYENNGANH_ID: chuyenNganhId },
            include: [{
                model: MonHoc,
                attributes: ['TENMONHOC', 'SOTINCHI']
            }]
        });

        const tongTinChi = khungDaoTao.reduce((sum, item) => {
            return sum + (item.MonHoc ? item.MonHoc.SOTINCHI : 0);
        }, 0);

        return res.status(200).json({
            success: true,
            tongTinChi: tongTinChi,
            data: khungDaoTao
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy khung chương trình đào tạo',
            error: error.message
        });
    }
};

export const addMonHocVaoChuongTrinh = async (req, res) => {
    const { CHUYENNGANH_ID, MONHOC_ID, LOAIMON } = req.body;

    try {
        const existingRecord = await ChuongTrinhDaoTao.findOne({
            where: { CHUYENNGANH_ID, MONHOC_ID }
        });

        if (existingRecord) {
            return res.status(400).json({
                success: false,
                message: 'Môn học này đã tồn tại trong chương trình đào tạo!'
            });
        }

        const newRecord = await ChuongTrinhDaoTao.create({
            CHUYENNGANH_ID,
            MONHOC_ID,
            LOAIMON: LOAIMON || 'BatBuoc'
        });

        return res.status(201).json({
            success: true,
            message: 'Thêm môn học vào khung chương trình thành công',
            data: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm môn học vào chương trình',
            error: error.message
        });
    }
};

export const removeMonHocKhoiChuongTrinh = async (req, res) => {
    const { CHUYENNGANH_ID, MONHOC_ID } = req.body;

    try {
        const record = await ChuongTrinhDaoTao.findOne({
            where: { CHUYENNGANH_ID, MONHOC_ID }
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy môn học này trong chương trình!'
            });
        }

        await record.destroy();

        return res.status(200).json({
            success: true,
            message: 'Đã gỡ môn học khỏi khung chương trình'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi gỡ môn học',
            error: error.message
        });
    }
};