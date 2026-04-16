export default (sequelize, DataTypes) => {
    return sequelize.define('LopHocPhan', {
        Id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        MaLop: { type: DataTypes.STRING(50), allowNull: false },
        GiangVien: { type: DataTypes.STRING(100) },
        MonHocId: { type: DataTypes.UUID, allowNull: false },
        HocKy: { type: DataTypes.STRING(20), allowNull: false },
        Sv_max: { type: DataTypes.INTEGER, defaultValue: 70 },
        Status: { 
            type: DataTypes.STRING(20), 
            defaultValue: 'Mo',
            validate: { isIn: [['Huy', 'KetThuc', 'DangHoc', 'Dong', 'Mo']] }
        },
        IsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'LopHocPhan', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' 
    });
};