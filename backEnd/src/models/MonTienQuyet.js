export default (sequelize, DataTypes) => {
    return sequelize.define('MonTienQuyet', {
        LOAIDIEUKIEN: { type: DataTypes.STRING(20), defaultValue: 'TienQuyet' }
    }, { 
        tableName: 'MONTIENQUYET', timestamps: false 
    });
};