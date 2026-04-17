export default (sequelize, DataTypes) => {
    return sequelize.define('GiangVien', {
        Id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        UserId: { type: DataTypes.UUID, allowNull: false },
        Teacher_id: { type: DataTypes.STRING(20), allowNull: false, unique: true },
        Full_name: { type: DataTypes.STRING(100), allowNull: false },
        Gender: { 
            type: DataTypes.STRING(10),
            validate: { isIn: [['Nam', 'Nữ', 'Khác']] }
        },
        Birthday: { type: DataTypes.DATEONLY },
        Phone: { type: DataTypes.STRING(15) },
        IsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'GiangVien', timestamps: true, createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' 
    });
};