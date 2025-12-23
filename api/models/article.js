'use strict';

module.exports = function (sequelize, DataTypes) {
    const article = sequelize.define('article', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            field:'codigo'
        },
        name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field:'descrip'
        },
        categoryId: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field:'rubro'
        },
        subcat: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'rubro'
        },
        subcategoryId: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'subrubro'
        },
        combo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            field: 'combo'
        }
    }, {
            tableName: 'articulo',
            schema: 'dbo',
            underscored: true,
            timestamps: false
        });


    article.associate = function (models) {
        article.belongsTo(models.category, { foreignKey: 'categoryId', targetKey: 'id' });
        article.belongsTo(models.subcategory, { foreignKey: 'subcat', targetKey: 'id' });
        // article.belongsTo(models.subSubcategoryId, { foreignKey: 'subcategoryId', targetKey: 'id' });
    };

    // article.associate = function (models) {
    //     article.belongsTo(models.category, { foreignKey: 'categoryId', targetKey: 'id' });
    //     article.belongsTo(models.subcategory, { foreignKey: 'subcategoryId', targetKey: 'id' });
    // };

    return article;
};
