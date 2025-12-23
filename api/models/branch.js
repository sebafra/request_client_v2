'use strict';

module.exports = function (sequelize, DataTypes) {
    const branch = sequelize.define('branch', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: 'num_local'
        },
        name: {
            type: DataTypes.CHAR(35),
            allowNull: false,
            field: 'nom_local'
        }
    }, {
            tableName: 'locales',
            schema: 'dbo',
            underscored: true,
            timestamps: false
        });

    return branch;
};
