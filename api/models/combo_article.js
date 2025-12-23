'use strict';

module.exports = function (sequelize, DataTypes) {
    const combo_article = sequelize.define('combo_article', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            field:'idk'
        },
        combo_id: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field:'combo'
        },
        group: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false,
            field:'rubro'
        },
        disabled: {
            type: DataTypes.BOOLEAN(),
            allowNull: false,
            field: 'anulado'
        },
        article_id: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'articulo'
        }
    }, {
            tableName: 'combprod',
            schema: 'dbo',
            underscored: true,
            timestamps: false
        });

    combo_article.associate = function (models) {
        combo_article.belongsTo(models.article, { foreignKey: 'article_id', targetKey: 'id' });
    };


    return combo_article;
};
