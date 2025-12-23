'use strict';

module.exports = function (sequelize, DataTypes) {
    const table = sequelize.define('table', {
        // idk: {
        //     primaryKey: true,
        //     type: DataTypes.INTEGER(4)
        // },
        id: {
            primaryKey: true,
            type: DataTypes.DECIMAL(4,0),
            allowNull: false,
            field: 'mesa',
        },
        status: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'estado'
        },
        waiter_name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'nom_mozo'
        },
        waiter: {
            type: DataTypes.DECIMAL(4,0),
            allowNull: false,
            field: 'mozo'
        },
        local: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'local'
        },
        map: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'plano'
        },
        people: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'cubiertos'
        },
        row: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'fila'
        },
        col: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'columna'
        },
        hunits: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'unidadesh'
        },
        vunits: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'unidadesv'
        },
        total: {
            type: DataTypes.DECIMAL(9,2),
            allowNull: false,
            field: 'total'
        },
        prefac: {
            type: DataTypes.BOOLEAN(),
            allowNull: false,
            field: 'prefac'
        }
    }, {
            tableName: 'mesas',
            schema: 'dbo',
            hasTrigger: true,
            underscored: true,
            timestamps: false
        });


    // article.associate = function (models) {
    //     article.belongsTo(models.category, { foreignKey: 'categoryId', targetKey: 'id' });
    //     article.belongsTo(models.subcategory, { foreignKey: 'subcategoryId', targetKey: 'id' });
    // };

    return table;
};
