export default (sequelize, DataTypes) => {
    return sequelize.define('MonHoc', {
        ID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        TENMONHOC: { type: DataTypes.STRING(100), allowNull: false },
        SOTINCHI: { type: DataTypes.INTEGER, allowNull: false },
        DAXOA: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'MONHOC', timestamps: true, createdAt: 'NGAYTAO', updatedAt: 'NGAYCAPNHAT' 
    });
};