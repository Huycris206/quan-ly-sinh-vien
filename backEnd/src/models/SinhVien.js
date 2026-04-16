export default (sequelize, DataTypes) => {
    return sequelize.define('SinhVien', {
        Id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        UserId: { type: DataTypes.UUID, allowNull: false, unique: true },
        Student_id: { type: DataTypes.STRING(20), allowNull: false, unique: true },
        Full_name: { type: DataTypes.STRING(100), allowNull: false },
        Gender: { 
            type: DataTypes.STRING(10),
            validate: { isIn: [['Nam', 'Nữ', 'Khác']] }
        },
        Birthday: { type: DataTypes.DATEONLY },
        Phone: { type: DataTypes.STRING(15) },
        ChuyenNganhId: { type: DataTypes.UUID, allowNull: false },
        TrangThai: { 
            type: DataTypes.STRING(20), 
            defaultValue: 'DangHoc',
            validate: { isIn: [['TotNghiep', 'ThoiHoc', 'BaoLuu', 'DangHoc']] }
        },
        IsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'SinhVien', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' 
    });
};