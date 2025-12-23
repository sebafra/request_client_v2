'use strict';

module.exports = function (sequelize, DataTypes) {
    const preference = sequelize.define('preference', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: 'idk'
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'descrip'
        },
        local: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'local'
        },
        code: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'codigo'
        }
    }, {
            tableName: 'preferen',
            schema: 'dbo',
            underscored: true,
            timestamps: false
        });


    preference.associate = function (models) {
        preference.belongsTo(models.article, { foreignKey: 'code', targetKey: 'id' });
    };

    return preference;
};
