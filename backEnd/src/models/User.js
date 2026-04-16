
import bcrypt from 'bcrypt';
export default (sequelize, DataTypes) => {
    return sequelize.define('User', {
        Id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        Username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        Password_hash: { type: DataTypes.STRING(255), allowNull: false },
        Role: { 
            type: DataTypes.STRING(20), 
            defaultValue: 'student',
            validate: { isIn: [['student', 'admin','teacher']] }
        },
        IsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'Users', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt', 
        hooks: {
            // Tự động chạy TRƯỚC KHI tạo mới 1 User
            beforeCreate: async (user) => {
                if (user.Password_hash) {
                    user.Password_hash = await bcrypt.hash(user.Password_hash, 10);
                }
            },
            // Tự động chạy TRƯỚC KHI cập nhật (đổi mật khẩu)
            beforeUpdate: async (user) => {
                if (user.changed('Password_hash')) { // Chỉ hash lại nếu người dùng thực sự đổi pass
                    user.Password_hash = await bcrypt.hash(user.Password_hash, 10);
                }
            }
        } }
    );
};