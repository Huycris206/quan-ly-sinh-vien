export default (sequelize, DataTypes) => {
    return sequelize.define('LichHoc', {
        ID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        THU: { type: DataTypes.INTEGER, allowNull: false },
        TIET_BATDAU: { type: DataTypes.INTEGER, allowNull: false },
        TIET_KETTHUC: { type: DataTypes.INTEGER, allowNull: false },
        PHONGHOC: { type: DataTypes.STRING(50), allowNull: false }
    }, { 
        tableName: 'LICHHOC', timestamps: false 
    });
};