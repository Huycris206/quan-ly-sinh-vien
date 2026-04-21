export default (sequelize, DataTypes) => {
    return sequelize.define('KetQuaHocTap', {
        DIEMCHUYENCAN: { type: DataTypes.FLOAT },
        DIEMGIUAKY: { type: DataTypes.FLOAT },
        DIEMCUOIKY: { type: DataTypes.FLOAT },
        DIEMTONGKET: { type: DataTypes.FLOAT },
        DIEMHECHU: { type: DataTypes.STRING(5) },
        TRANGTHAI_DANGKY: { type: DataTypes.STRING(20), defaultValue: 'ThanhCong' }
    }, { 
        tableName: 'KETQUAHOCTAP', timestamps: true, createdAt: 'NGAYTAO', updatedAt: 'NGAYCAPNHAT' 
    });
};