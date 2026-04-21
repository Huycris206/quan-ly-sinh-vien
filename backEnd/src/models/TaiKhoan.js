
import bcrypt from 'bcrypt';
export default (sequelize, DataTypes) => {
    return sequelize.define('TaiKhoan', {
        ID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        TENDANGNHAP: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        MATKHAU: { type: DataTypes.STRING(255), allowNull: false },
        VAITRO: { type: DataTypes.STRING(20), defaultValue: 'sinhvien' },
        ANHDAIDIEN: { type: DataTypes.STRING(500) },
        DAXOA: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'TAIKHOAN', timestamps: true, createdAt: 'NGAYTAO', updatedAt: 'NGAYCAPNHAT' ,
        hooks: {

            // Tự động chạy TRƯỚC KHI tạo mới 1 User

            beforeCreate: async (TaiKhoan) => {

                if (TaiKhoan.MATKHAU) { // Chỉ hash nếu có mật khẩu được cung cấp

                    TaiKhoan.MATKHAU = await bcrypt.hash(TaiKhoan.MATKHAU, 10);

                  

                }

            },

            // Tự động chạy TRƯỚC KHI cập nhật (đổi mật khẩu)

            beforeUpdate: async (TAIKHOAN) => {

                if (TAIKHOAN.changed('MATKHAU')) { // Chỉ hash lại nếu người dùng thực sự đổi pass

                    TAIKHOAN.MATKHAU = await bcrypt.hash(TAIKHOAN.MATKHAU, 10);

                }

            }

        }
    });
};