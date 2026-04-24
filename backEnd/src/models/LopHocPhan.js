export default (sequelize, DataTypes) => {
    return sequelize.define('LopHocPhan', {
        Id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        MaLop: { type: DataTypes.STRING(50), allowNull: false },
        Teacher_Id: { type: DataTypes.STRING(20), allowNull: false },
        MonHocId: { type: DataTypes.UUID, allowNull: false },
        HocKy: { type: DataTypes.STRING(20), allowNull: false },
        Sv_max: { type: DataTypes.INTEGER, defaultValue: 70 },
        Status: { 
            type: DataTypes.STRING(20), 
            defaultValue: 'Mo',
            validate: { isIn: [['Huy', 'KetThuc', 'DangHoc', 'Dong', 'Mo']] }
        },
        IsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
        ID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        MALOP: { type: DataTypes.STRING(50), allowNull: false },
        HOCKY: { type: DataTypes.STRING(20), allowNull: false },
        SISO_TOIDA: { type: DataTypes.INTEGER, defaultValue: 70 },
        TRANGTHAI: { type: DataTypes.STRING(20), defaultValue: 'Mo' },
        DAXOA: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { 
        tableName: 'LOPHOCPHAN', timestamps: true, createdAt: 'NGAYTAO', updatedAt: 'NGAYCAPNHAT' 
    });
};