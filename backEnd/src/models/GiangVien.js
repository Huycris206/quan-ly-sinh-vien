export default (sequelize, DataTypes) => {
    return sequelize.define('GiangVien', {
        ID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        MAGV: { type: DataTypes.STRING(20), allowNull: false, unique: true },
        HOTEN: { type: DataTypes.STRING(100), allowNull: false },
        GIOITINH: { type: DataTypes.STRING(10) },
        NGAYSINH: { type: DataTypes.DATEONLY },
        CCCD: { type: DataTypes.STRING(20), unique: true },
        SDT: { type: DataTypes.STRING(15) },
        DAXOA: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'GIANGVIEN', timestamps: true, createdAt: 'NGAYTAO', updatedAt: 'NGAYCAPNHAT' 
    });
};