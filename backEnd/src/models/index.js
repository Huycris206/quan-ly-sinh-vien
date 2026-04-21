import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Nhớ thêm .js khi import file tự viết

// 1. Import các hàm định nghĩa model
;

import defineTaiKhoan from './TaiKhoan.js';
import defineNganh from './Nganh.js';
import defineChuyenNganh from './ChuyenNganh.js';
import defineSinhVien from './SinhVien.js';
import defineGiangVien from './GiangVien.js';
import defineMonHoc from './MonHoc.js';
import defineLopHocPhan from './LopHocPhan.js';
import defineKetQuaHocTap from './KetQuaHocTap.js';
import defineChuongTrinhDaoTao from './ChuongTrinhDaoTao.js';
import defineMonTienQuyet from './MonTienQuyet.js';
import defineLichHoc from './LichHoc.js';

// 3. Khởi tạo các Model
const TaiKhoan = defineTaiKhoan(sequelize, DataTypes);
const Nganh = defineNganh(sequelize, DataTypes);
const ChuyenNganh = defineChuyenNganh(sequelize, DataTypes);
const SinhVien = defineSinhVien(sequelize, DataTypes);
const GiangVien = defineGiangVien(sequelize, DataTypes);
const MonHoc = defineMonHoc(sequelize, DataTypes);
const LopHocPhan = defineLopHocPhan(sequelize, DataTypes);
const KetQuaHocTap = defineKetQuaHocTap(sequelize, DataTypes);
const ChuongTrinhDaoTao = defineChuongTrinhDaoTao(sequelize, DataTypes);
const MonTienQuyet = defineMonTienQuyet(sequelize, DataTypes);
const LichHoc = defineLichHoc(sequelize, DataTypes);

// ==========================================
// 4. THIẾT LẬP MỐI QUAN HỆ (ASSOCIATIONS)
// Khóa ngoại được viết IN HOA để khớp với CSDL
// ==========================================

// 1-1: Tài khoản - Sinh viên / Giảng viên
TaiKhoan.hasOne(SinhVien, { foreignKey: 'TAIKHOAN_ID' });
SinhVien.belongsTo(TaiKhoan, { foreignKey: 'TAIKHOAN_ID' });

TaiKhoan.hasOne(GiangVien, { foreignKey: 'TAIKHOAN_ID' });
GiangVien.belongsTo(TaiKhoan, { foreignKey: 'TAIKHOAN_ID' });

// 1-N: Ngành - Chuyên ngành
Nganh.hasMany(ChuyenNganh, { foreignKey: 'NGANH_ID' });
ChuyenNganh.belongsTo(Nganh, { foreignKey: 'NGANH_ID' });

// 1-N: Chuyên ngành - Sinh viên
ChuyenNganh.hasMany(SinhVien, { foreignKey: 'CHUYENNGANH_ID' });
SinhVien.belongsTo(ChuyenNganh, { foreignKey: 'CHUYENNGANH_ID' });

// 1-N: Môn học - Lớp học phần
MonHoc.hasMany(LopHocPhan, { foreignKey: 'MONHOC_ID' });
LopHocPhan.belongsTo(MonHoc, { foreignKey: 'MONHOC_ID' });

// 1-N: Giảng viên - Lớp học phần
GiangVien.hasMany(LopHocPhan, { foreignKey: 'GIANGVIEN_ID' });
LopHocPhan.belongsTo(GiangVien, { foreignKey: 'GIANGVIEN_ID' });

// 1-N: Lớp học phần - Lịch học
LopHocPhan.hasMany(LichHoc, { foreignKey: 'LOPHOCPHAN_ID' });
LichHoc.belongsTo(LopHocPhan, { foreignKey: 'LOPHOCPHAN_ID' });

// N-M: Sinh viên - Lớp học phần (Qua bảng KETQUAHOCTAP)
SinhVien.belongsToMany(LopHocPhan, { through: KetQuaHocTap, foreignKey: 'SINHVIEN_ID', otherKey: 'LOPHOCPHAN_ID' });
LopHocPhan.belongsToMany(SinhVien, { through: KetQuaHocTap, foreignKey: 'LOPHOCPHAN_ID', otherKey: 'SINHVIEN_ID' });

// N-M: Chuyên ngành - Môn học (Qua bảng CHUONGTRINHDAOTAO)
ChuyenNganh.belongsToMany(MonHoc, { through: ChuongTrinhDaoTao, foreignKey: 'CHUYENNGANH_ID', otherKey: 'MONHOC_ID' });
MonHoc.belongsToMany(ChuyenNganh, { through: ChuongTrinhDaoTao, foreignKey: 'MONHOC_ID', otherKey: 'CHUYENNGANH_ID' });

// N-M (Self-referencing): Môn học - Môn tiên quyết
MonHoc.belongsToMany(MonHoc, { 
    as: 'MonHocTruoc', // Tên alias khi query Include
    through: MonTienQuyet, 
    foreignKey: 'MONHOC_ID', 
    otherKey: 'MONHOC_TRUOC_ID' 
});
MonHoc.belongsToMany(MonHoc, { 
    as: 'MonTiepTheo', 
    through: MonTienQuyet, 
    foreignKey: 'MONHOC_TRUOC_ID', 
    otherKey: 'MONHOC_ID' 
});

// 5. Export để sử dụng ở các Controller/Service
export {
    sequelize,
    TaiKhoan,
    Nganh,
    ChuyenNganh,
    SinhVien,
    GiangVien,
    MonHoc,
    LopHocPhan,
    KetQuaHocTap,
    ChuongTrinhDaoTao,
    MonTienQuyet,
    LichHoc
};