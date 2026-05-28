export default (sequelize, DataTypes) => {
    return sequelize.define('LopHocPhan', {
        ID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        MALOP: { type: DataTypes.STRING(50), allowNull: false },
        HOCKY: { type: DataTypes.STRING(20), allowNull: false },
        SISO: { type: DataTypes.INTEGER, defaultValue: 0 },
        SISO_TOIDA: { type: DataTypes.INTEGER, defaultValue: 70 },
        TRANGTHAI: { type: DataTypes.STRING(20), defaultValue: 'Mo' },
        DAXOA: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'LOPHOCPHAN', timestamps: true, createdAt: 'NGAYTAO', updatedAt: 'NGAYCAPNHAT' 
    });
};