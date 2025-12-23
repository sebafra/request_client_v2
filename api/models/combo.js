'use strict';

module.exports = function (sequelize, DataTypes) {
    const combo = sequelize.define('combo', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            field:'combo'
        },
        // combo_id: {
        //     type: DataTypes.STRING(4),
        //     allowNull: false,
        //     field:'combo'
        // },
        group_1_name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field:'rubro1'
        },
        group_1_ud: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false,
            field: 'cant1'
        },
        group_2_name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            field:'rubro2'
        },
        group_2_ud: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false,
            field: 'cant2'
        },
        group_2_name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            field:'rubro2'
        },
        group_2_ud: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false,
            field: 'cant2'
        },
        group_3_name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            field:'rubro3'
        },
        group_3_ud: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false,
            field: 'cant3'
        },
        group_4_name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            field:'rubro4'
        },
        group_4_ud: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false,
            field: 'cant4'
        },
        group_5_name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            field:'rubro5'
        },
        group_5_ud: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false,
            field: 'cant5'
        }
    }, {
            tableName: 'combos',
            schema: 'dbo',
            underscored: true,
            timestamps: false
        });


    return combo;
};
