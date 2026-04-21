import { KetQuaHocTap, SinhVien, LopHocPhan, MonHoc } from "../models/index.js";

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
    const { SINHVIEN_ID, LOPHOCPHAN_ID, DIEMCHUYENCAN, DIEMGIUAKY, DIEMCUOIKY, DIEMTONGKET, DIEMHECHU } = req.body;

    try {
        const ketQua = await KetQuaHocTap.findOne({
            where: { SINHVIEN_ID, LOPHOCPHAN_ID }
        });

        if (!ketQua) {
            return res.status(404).json({
                success: false,
                message: 'Sinh viên này không nằm trong lớp học phần này!'
            });
        }

        await ketQua.update({ DIEMCHUYENCAN, DIEMGIUAKY, DIEMCUOIKY, DIEMTONGKET, DIEMHECHU });

        return res.status(200).json({
            success: true,
            message: 'Cập nhật điểm thành công',
            data: ketQua
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật điểm',
            error: error.message
        });
    }
};