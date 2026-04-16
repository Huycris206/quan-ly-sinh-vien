export default (sequelize, DataTypes) => {
    return sequelize.define('KetQuaHocTap', {
        SinhVienId: { type: DataTypes.UUID, primaryKey: true },
        LopHocPhanId: { type: DataTypes.UUID, primaryKey: true },
        DiemSo: { 
            type: DataTypes.FLOAT, 
            defaultValue: 0.0,
            validate: { min: 0.0, max: 10.0 }
        }
    }, { 
        tableName: 'KetQuaHocTap', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' 
    });
};