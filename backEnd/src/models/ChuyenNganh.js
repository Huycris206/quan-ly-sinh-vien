export default (sequelize, DataTypes) => {
    return sequelize.define('ChuyenNganh', {
        Id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        NganhId: { type: DataTypes.UUID, allowNull: false },
        Name: { type: DataTypes.STRING(100), allowNull: false },
        IsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'ChuyenNganh', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' 
    });
};