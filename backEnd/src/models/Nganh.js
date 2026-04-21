export default (sequelize, DataTypes) => {
    return sequelize.define('Nganh', {
        ID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        TENNGANH: { type: DataTypes.STRING(100), allowNull: false },
        DAXOA: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'NGANH', timestamps: true, createdAt: 'NGAYTAO', updatedAt: 'NGAYCAPNHAT' 
    });
};