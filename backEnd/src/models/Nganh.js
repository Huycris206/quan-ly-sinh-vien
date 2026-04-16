export default (sequelize, DataTypes) => {
    return sequelize.define('Nganh', {
        Id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        Name: { type: DataTypes.STRING(100), allowNull: false },
        IsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'Nganh', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' 
    });
};