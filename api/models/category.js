'use strict';

module.exports = function (sequelize, DataTypes) {
    const category = sequelize.define('category', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            field:'r_codigo'
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field:'r_descrip'
        },
        icon: {
            type: DataTypes.CHAR(20),
            allowNull: false,
            field:'graficoapp'
        },
        code: {
            type: DataTypes.DECIMAL(4,0),
            allowNull: false,
            field:'r_codha'
        }
        // title: {
        //     type: DataTypes.STRING(5000),
        //     allowNull: false
        // },
        // description: {
        //     type: DataTypes.STRING(5000),
        //     allowNull: false
        // },
        // image: {
        //     type: DataTypes.STRING(150)
        // },
        // brandId: {
        //     type: DataTypes.UUID
        // },
        // modelId: {
        //     type: DataTypes.UUID
        // },
        // year: {
        //     type: DataTypes.INTEGER
        // }
    }, {
            tableName: 'rubro',
            schema: 'dbo',
            underscored: true,
            timestamps: false
        });


    // category.associate = function (models) {
    //     category.belongsTo(models.model, { foreignKey: 'modelId', targetKey: 'id' });
    //     category.belongsTo(models.brand, { foreignKey: 'brandId', targetKey: 'id' });
    // };

    return category;
};
