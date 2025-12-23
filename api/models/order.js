'use strict';

module.exports = function (sequelize, DataTypes) {
    const order = sequelize.define('order', {
        // id: {
        //     primaryKey: true,
        //     type: DataTypes.DECIMAL(4,0),
        //     allowNull: false,
        //     field: 'mesa',
        // },
        table: {
            type: DataTypes.DECIMAL(8, 0),
            allowNull: false,
            field: 'mesa'
        },
        waiter: {
            type: DataTypes.DECIMAL(8, 0),
            allowNull: false,
            field: 'mozo'
        },
        code: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'codigo'
        },
        quantity: {
            type: DataTypes.DECIMAL(11, 5),
            allowNull: false,
            field: 'cantidad'
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'descrip'
        },
        price: {
            type: DataTypes.DECIMAL(19, 10),
            allowNull: false,
            defaultValue: 0,
            field: 'precio'
        },
        preference: {
            type: DataTypes.STRING(500),
            allowNull: false,
            field: 'preferen'
        },
        item: {
            type: DataTypes.DECIMAL(4, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'item'
        },
        ticket: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
            field: 'comanda'
        },
        priority: {
            type: DataTypes.DECIMAL(1, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'prioridad'
        },
        orderTime: {
            type: DataTypes.STRING(9),
            allowNull: false,
            defaultValue: '',
            field: 'hora_pedid'
        },
        person1: {
            type: DataTypes.DECIMAL(2, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'comenzal1'
        },
        person2: {
            type: DataTypes.DECIMAL(2, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'comenzal2'
        },
        person3: {
            type: DataTypes.DECIMAL(2, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'comenzal3'
        },
        person4: {
            type: DataTypes.DECIMAL(2, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'comenzal4'
        },
        person5: {
            type: DataTypes.DECIMAL(2, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'comenzal5'
        },
        person6: {
            type: DataTypes.DECIMAL(2, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'comenzal6'
        },
        person7: {
            type: DataTypes.DECIMAL(2, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'comenzal7'
        },
        person8: {
            type: DataTypes.DECIMAL(2, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'comenzal8'
        },
        person9: {
            type: DataTypes.DECIMAL(2, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'comenzal9'
        },
        // date: {
        //     type: DataTypes.DATE,
        //     allowNull: true,
        //     field: 'fecha'
        // },
        line: {
            type: DataTypes.DECIMAL(3, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'linea'
        },
        points: {
            type: DataTypes.DECIMAL(10, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'puntos'
        },
        client: {
            type: DataTypes.DECIMAL(15, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'cliente'
        },
        iva: {
            type: DataTypes.DECIMAL(13, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'iva'
        },
        percentage: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'porcen'
        },
        hora_com: {
            type: DataTypes.STRING(8),
            allowNull: false,
            defaultValue: '',
            field: 'hora_com'
        },
        // fecha_com: {
        //     type: DataTypes.DATE,
        //     allowNull: true,
        //     field: 'fecha_com'
        // },
        no_graba: {
            type: DataTypes.DECIMAL(12, 5),
            allowNull: false,
            defaultValue: 0,
        },
        reserve_code: {
            type: DataTypes.DECIMAL(8, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'codreserva'
        },
        local_box: {
            type: DataTypes.DECIMAL(10, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'cajalocal'
        },
        num_pc: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            defaultValue: 0
        },
        // Combo start
        combo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        combo_group: {
            type: DataTypes.DECIMAL(2, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'crubro'
        },
        combo_item: {
            type: DataTypes.DECIMAL(4, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'itemcombo'
        },
        //Combo End
        week: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: '',
            field: 'semana'
        },
        // fecprod: {
        //     type: DataTypes.DATE,
        //     allowNull: true,
        // },
        // fecent: {
        //     type: DataTypes.DATE,
        //     allowNull: true,
        // },
        // fecont: {
        //     type: DataTypes.DATE,
        //     allowNull: true,
        // },
        lunch: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: '',
            field: 'vianda'
        },
        client_address: {
            type: DataTypes.DECIMAL(1, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'dircli'
        },
        client_zone: {
            type: DataTypes.DECIMAL(1, 0),
            allowNull: false,
            defaultValue: 0,
            field: 'zoncli'
        },
        observation: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: '',
            field: 'observac'
        },
        tax: {
            type: DataTypes.DECIMAL(12, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'impuesto'
        },
        cortesy: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0,
            field: 'cortesia'
        },
        s1: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
        },
        s2: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
        },
        s3: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
        },
        s4: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
        },
        s5: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
        },
        s6: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
        },
        s7: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
        },
        s8: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
        },
        s9: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
        },
        palm: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: '',
        },
        net_dif: {
            type: DataTypes.DECIMAL(12, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'netodif'
        },
        mandant: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: '',
            field: 'mandante',
        },
        discount: {
            type: DataTypes.DECIMAL(12, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'descuento'
        },
        pcombo: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: false,
            defaultValue: 0,
        },
        tax_1: {
            type: DataTypes.DECIMAL(11, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'impues1'
        },
        tax_2: {
            type: DataTypes.DECIMAL(11, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'impues2'
        },
        tax_3: {
            type: DataTypes.DECIMAL(11, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'impues3'
        },
        tax_4: {
            type: DataTypes.DECIMAL(11, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'impues4'
        },
        chairs: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
            field: 'sillas'
        },
        precori: {
            type: DataTypes.DECIMAL(12, 5),
            allowNull: false,
            defaultValue: 0,
        },
        recover: {
            type: DataTypes.DECIMAL(12, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'recupera'
        },
        promoerp: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: '',
        },
        total: {
            type: DataTypes.DECIMAL(19, 10),
            allowNull: false,
            defaultValue: 0,
        },
        recalculate: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'recalcula'
        },
        price_k: {
            type: DataTypes.DECIMAL(11, 3),
            allowNull: false,
            defaultValue: 0,
            field: 'preciok'
        },
        disconunt_k: {
            type: DataTypes.DECIMAL(12, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'descuk'
        },
        um: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: '',
        },
        barcode: {
            type: DataTypes.STRING(18),
            allowNull: false,
            defaultValue: '',
            field: 'codbarra'
        },
        barcode2: {
            type: DataTypes.STRING(18),
            allowNull: false,
            defaultValue: '',
            field: 'codbarr2'
        },
        barcode3: {
            type: DataTypes.STRING(18),
            allowNull: false,
            defaultValue: '',
            field: 'codbarr3'
        },
        barcode4: {
            type: DataTypes.STRING(18),
            allowNull: false,
            defaultValue: '',
            field: 'codbarr4'
        },
        moduloext: {
            type: DataTypes.DECIMAL(3, 0),
            allowNull: false,
            defaultValue: 0,
        },
        aduana1: {
            type: DataTypes.STRING(60),
            allowNull: false,
            defaultValue: '',
        },
        aduana2: {
            type: DataTypes.STRING(60),
            allowNull: false,
            defaultValue: '',
        },
        idlist: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: '',
            field: 'idlista'
        },
        canaux: {
            type: DataTypes.DECIMAL(11, 5),
            allowNull: false,
            defaultValue: 0,
        },
        cost: {
            type: DataTypes.DECIMAL(11, 5),
            allowNull: false,
            defaultValue: 0,
            field: 'costo'
        },
        play: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0,
            field: 'marchar'
        },
        porcdif: {
            type: DataTypes.DECIMAL(11, 5),
            allowNull: false,
            defaultValue: 0
        },
        ivadif: {
            type: DataTypes.DECIMAL(11, 5),
            allowNull: false,
            defaultValue: 0
        },
        desccombo: {
            type: DataTypes.DECIMAL(12, 5),
            allowNull: false,
            defaultValue: 0
        },
        porccombo: {
            type: DataTypes.DECIMAL(12, 5),
            allowNull: false,
            defaultValue: 0
        }
        // ui: {
        //     type: DataTypes.UUID,
        //     allowNull: false,
        //     defaultValue: ''
        // },
        // ts: {
        //     type: DataTypes.NOW,
        //     allowNull: false,
        //     defaultValue: ''
        // },
        // tx: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        //     defaultValue: 0
        // },
        // local: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     defaultValue: 0
        // },
        // id_ext: {
        //     type: DataTypes.DECIMAL(15, 0),
        //     allowNull: false,
        //     defaultValue: 0,
        //     field: 'id'
        // },
        // ox: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     defaultValue: 0
        // }
    }, {
            tableName: 'factura',
            schema: 'dbo',
            hasTrigger: true,
            underscored: true,
            timestamps: false
        });


    // article.associate = function (models) {
    //     article.belongsTo(models.category, { foreignKey: 'categoryId', targetKey: 'id' });
    //     article.belongsTo(models.subcategory, { foreignKey: 'subcategoryId', targetKey: 'id' });
    // };

    return order;
};
