export default (sequelize, DataTypes) => {
    return sequelize.define('ChuyenNganh', {
        ID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        TENCHUYENNGANH: { type: DataTypes.STRING(100), allowNull: false },
        DAXOA: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'CHUYENNGANH', timestamps: true, createdAt: 'NGAYTAO', updatedAt: 'NGAYCAPNHAT' 
    });
};