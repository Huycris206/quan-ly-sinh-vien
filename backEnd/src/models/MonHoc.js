export default (sequelize, DataTypes) => {
    return sequelize.define('MonHoc', {
        Id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        Name: { type: DataTypes.STRING(100), allowNull: false },
        TinChi: { type: DataTypes.INTEGER, allowNull: false },
        IsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'MonHoc', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' 
    });
};