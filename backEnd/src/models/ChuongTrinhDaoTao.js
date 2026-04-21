export default (sequelize, DataTypes) => {
    return sequelize.define('ChuongTrinhDaoTao', {
        LOAIMON: { type: DataTypes.STRING(20), defaultValue: 'BatBuoc' }
    }, { 
        tableName: 'CHUONGTRINHDAOTAO', timestamps: true, createdAt: 'NGAYTAO', updatedAt: false 
    });
};