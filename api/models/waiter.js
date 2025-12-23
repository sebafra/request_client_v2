'use strict';

module.exports = function (sequelize, DataTypes) {
    const waiter = sequelize.define('waiter', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            field: 'vendedor'
        },
        name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'nombre'
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            field: 'inhab'
        }
    }, {
            tableName: 'vendedor',
            schema: 'dbo',
            underscored: true,
            timestamps: false
        });

    return waiter;
};
