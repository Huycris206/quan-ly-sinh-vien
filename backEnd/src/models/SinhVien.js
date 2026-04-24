export default (sequelize, DataTypes) => {
    return sequelize.define('SinhVien', {
        ID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        MASV: { type: DataTypes.STRING(20), allowNull: false, unique: true },
        HOTEN: { type: DataTypes.STRING(100), allowNull: false },
        GIOITINH: { type: DataTypes.STRING(10) },
        NGAYSINH: { type: DataTypes.DATEONLY },
        SDT: { type: DataTypes.STRING(15) },
        EMAIL: { type: DataTypes.STRING(100) },
        CCCD: { type: DataTypes.STRING(20), unique: true },
        QUEQUAN: { type: DataTypes.STRING(255) },
        DIACHI: { type: DataTypes.STRING(255) },
        KHOAHOC: { type: DataTypes.STRING(20) },
        TRANGTHAI: { type: DataTypes.STRING(20), defaultValue: 'DangHoc' },
        DAXOA: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'SINHVIEN', timestamps: true, createdAt: 'NGAYTAO', updatedAt: 'NGAYCAPNHAT' 
    });
};