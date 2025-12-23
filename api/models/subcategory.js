'use strict';

module.exports = function (sequelize, DataTypes) {
    const subcategory = sequelize.define('subcategory', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            field:'rr_codigo'
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field:'rr_descrip'
        },
        categoryId: {
            type: DataTypes.UUID,
            field: 'rr_rcod'
        }
    }, {
            tableName: 'rrubro',
            schema: 'dbo',
            underscored: true,
            timestamps: false
        });


    subcategory.associate = function (models) {
        subcategory.belongsTo(models.category, { foreignKey: 'categoryId', targetKey: 'id' });
    };

    return subcategory;
};
