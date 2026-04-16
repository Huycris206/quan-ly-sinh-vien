export default (sequelize, DataTypes) => {
    return sequelize.define('ChuongTrinhDaoTao', {
        ChuyenNganhId: { type: DataTypes.UUID, primaryKey: true },
        MonHocId: { type: DataTypes.UUID, primaryKey: true },
        LoaiMon: { 
            type: DataTypes.STRING(20), 
            defaultValue: 'BatBuoc',
            validate: { isIn: [['TuChon', 'BatBuoc']] }
        }
    }, { 
        tableName: 'ChuongTrinhDaoTao', timestamps: true, createdAt: 'CreatedAt', updatedAt: false 
    });
};