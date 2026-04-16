import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Nhớ thêm .js khi import file tự viết

// 1. Import các hàm định nghĩa model
import defineUser from './User.js';
import defineNganh from './Nganh.js';
import defineChuyenNganh from './ChuyenNganh.js';
import defineSinhVien from './SinhVien.js';
import defineMonHoc from './MonHoc.js';
import defineLopHocPhan from './LopHocPhan.js';
import defineKetQuaHocTap from './KetQuaHocTap.js';
import defineChuongTrinhDaoTao from './ChuongTrinhDaoTao.js';

// 2. Khởi tạo các Model
const User = defineUser(sequelize, DataTypes);
const Nganh = defineNganh(sequelize, DataTypes);
const ChuyenNganh = defineChuyenNganh(sequelize, DataTypes);
const SinhVien = defineSinhVien(sequelize, DataTypes);
const MonHoc = defineMonHoc(sequelize, DataTypes);
const LopHocPhan = defineLopHocPhan(sequelize, DataTypes);
const KetQuaHocTap = defineKetQuaHocTap(sequelize, DataTypes);
const ChuongTrinhDaoTao = defineChuongTrinhDaoTao(sequelize, DataTypes);

// 3. Thiết lập Mối quan hệ (Associations)
User.hasOne(SinhVien, { foreignKey: 'UserId' });
SinhVien.belongsTo(User, { foreignKey: 'UserId' });

Nganh.hasMany(ChuyenNganh, { foreignKey: 'NganhId' });
ChuyenNganh.belongsTo(Nganh, { foreignKey: 'NganhId' });

ChuyenNganh.hasMany(SinhVien, { foreignKey: 'ChuyenNganhId' });
SinhVien.belongsTo(ChuyenNganh, { foreignKey: 'ChuyenNganhId' });

MonHoc.hasMany(LopHocPhan, { foreignKey: 'MonHocId' });
LopHocPhan.belongsTo(MonHoc, { foreignKey: 'MonHocId' });

ChuyenNganh.belongsToMany(MonHoc, { through: ChuongTrinhDaoTao, foreignKey: 'ChuyenNganhId', otherKey: 'MonHocId' });
MonHoc.belongsToMany(ChuyenNganh, { through: ChuongTrinhDaoTao, foreignKey: 'MonHocId', otherKey: 'ChuyenNganhId' });

SinhVien.belongsToMany(LopHocPhan, { through: KetQuaHocTap, foreignKey: 'SinhVienId', otherKey: 'LopHocPhanId' });
LopHocPhan.belongsToMany(SinhVien, { through: KetQuaHocTap, foreignKey: 'LopHocPhanId', otherKey: 'SinhVienId' });

// 4. Export để sử dụng ở các file khác (Controllers, Services...)
export {
    sequelize,
    User,
    Nganh,
    ChuyenNganh,
    SinhVien,
    MonHoc,
    LopHocPhan,
    KetQuaHocTap,
    ChuongTrinhDaoTao
};