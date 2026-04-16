import { ChuongTrinhDaoTao, ChuyenNganh, MonHoc } from "../models/index.js";

// [Nghiệp vụ 1]: Lấy toàn bộ môn học thuộc 1 Chuyên Ngành (Khung chương trình)
export const getKhungChuongTrinh = async (req, res) => {
    const { chuyenNganhId } = req.params;
    try {
        const khungDaoTao = await ChuongTrinhDaoTao.findAll({
            where: { ChuyenNganhId: chuyenNganhId },
            include: [{
                model: MonHoc,
                attributes: ['Name', 'TinChi'] // Lấy tên môn và số tín chỉ
            }]
        });

        // Tính tổng số tín chỉ của chuyên ngành này (Tùy chọn thêm để Frontend hiển thị)
        const tongTinChi = khungDaoTao.reduce((sum, item) => {
            return sum + (item.MonHoc ? item.MonHoc.TinChi : 0);
        }, 0);

        return res.status(200).json({ 
            success: true, 
            tongTinChi: tongTinChi,
            data: khungDaoTao 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi lấy khung chương trình đào tạo', 
            error: error.message 
        });
    }
};

// [Nghiệp vụ 2]: Thêm một môn học vào chương trình đào tạo của chuyên ngành
export const addMonHocVaoChuongTrinh = async (req, res) => {
    const { ChuyenNganhId, MonHocId, LoaiMon } = req.body;
    
    try {
        // Kiểm tra xem môn này đã có trong chuyên ngành chưa để tránh lỗi Duplicate Key
        const existingRecord = await ChuongTrinhDaoTao.findOne({ 
            where: { ChuyenNganhId, MonHocId } 
        });
        
        if (existingRecord) {
            return res.status(400).json({
                success: false,
                message: 'Môn học này đã tồn tại trong chương trình đào tạo!'
            });
        }

        const newRecord = await ChuongTrinhDaoTao.create({ 
            ChuyenNganhId, 
            MonHocId, 
            LoaiMon: LoaiMon || 'BatBuoc' 
        });

        return res.status(201).json({
            success: true,
            message: 'Thêm môn học vào khung chương trình thành công!',
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

// [Nghiệp vụ 3]: Gỡ 1 môn học khỏi khung chương trình
export const removeMonHocKhoiChuongTrinh = async (req, res) => {
    // Truyền qua body hoặc params đều được, ở đây ví dụ qua body
    const { ChuyenNganhId, MonHocId } = req.body; 
    
    try {
        const record = await ChuongTrinhDaoTao.findOne({ 
            where: { ChuyenNganhId, MonHocId } 
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy môn học này trong chương trình!'
            });
        }

        // Bảng này không có IsDeleted (Soft Delete), nên ta dùng Hard Delete (destroy)
        await record.destroy();

        return res.status(200).json({
            success: true,
            message: 'Đã gỡ môn học khỏi khung chương trình.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi gỡ môn học',
            error: error.message
        });
    }
};