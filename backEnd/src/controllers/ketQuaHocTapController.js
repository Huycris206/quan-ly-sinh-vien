import { KetQuaHocTap, SinhVien, LopHocPhan, MonHoc } from "../models/index.js";

// [Nghiệp vụ 1]: Giảng viên lấy danh sách sinh viên trong 1 lớp học phần để nhập điểm
export const getDiemByLopHocPhan = async (req, res) => {
    const { lopHocPhanId } = req.params;
    try {
        const danhSachDiem = await KetQuaHocTap.findAll({
            where: { LopHocPhanId: lopHocPhanId },
            include: [{
                model: SinhVien,
                attributes: ['Student_id', 'Full_name'] // Kéo theo Mã SV và Tên SV
            }]
        });

        return res.status(200).json({ success: true, data: danhSachDiem });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy bảng điểm', error: error.message });
    }
};

// [Nghiệp vụ 2]: Sinh viên xem bảng điểm cá nhân của mình
export const getBangDiemCaNhan = async (req, res) => {
    const { sinhVienId } = req.params;
    try {
        const bangDiem = await KetQuaHocTap.findAll({
            where: { SinhVienId: sinhVienId },
            include: [{
                model: LopHocPhan,
                attributes: ['MaLop', 'HocKy'],
                include: [{
                    model: MonHoc,
                    attributes: ['Name', 'TinChi'] // Kéo theo Tên môn và Số tín chỉ để tính điểm trung bình
                }]
            }]
        });

        return res.status(200).json({ success: true, data: bangDiem });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy bảng điểm cá nhân', error: error.message });
    }
};

// [Nghiệp vụ 3]: Cập nhật điểm cho 1 sinh viên trong 1 lớp (Giảng viên nhập điểm)
export const updateDiemSinhVien = async (req, res) => {
    const { SinhVienId, LopHocPhanId, DiemSo } = req.body;
    
    try {
        // Tìm dòng kết quả học tập khớp cả 2 ID (Khóa chính kép)
        const ketQua = await KetQuaHocTap.findOne({ 
            where: { SinhVienId, LopHocPhanId } 
        });
        
        if (!ketQua) {
            return res.status(404).json({
                success: false,
                message: 'Sinh viên này không nằm trong lớp học phần này!'
            });
        }
       
        // Cập nhật điểm
        await ketQua.update({ DiemSo });

        return res.status(200).json({
            success: true,  
            message: 'Cập nhật điểm thành công',
            data: ketQua
        });
    } catch (error) {
        // Validation lỗi (VD: nhập điểm 11) sẽ bị catch ở đây
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật điểm',
            error: error.message
        });
    }
};