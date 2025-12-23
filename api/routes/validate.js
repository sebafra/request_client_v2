const helpers = require('./_helpers.js');
const express = require('express');
const router = express.Router();
const models = require('../models');
const trae = require('trae');
const settings = require('../config/settings.js').request

router.get('/', (req, res) => {
    if (!settings.manager.offline) {        
        // Usar Supabase en lugar de la API anterior
        const supabaseUrl = settings.manager.supabase.baseUrl + '/users?id=eq.' + settings.branchId;
        
        trae.get(supabaseUrl, {
            headers: settings.manager.supabase.headers
        })
        .then((response) => {
            let dataResponse = response.data[0];
            console.log("Respuesta Supabase", dataResponse);
            /**
             * TODO: Actualizar en la app estos registros
             * Mapeo para que sea como la respuesta de la api anterior
             */
            const responseData = {
                ...dataResponse,
                createdAt: dataResponse.created_at,
                numLocal: dataResponse.num_local,
                nomLocal: dataResponse.nom_local,
                endSuscription: dataResponse.end_suscription
            }
            delete responseData.created_at;
            delete responseData.num_local;
            delete responseData.nom_local;
            delete responseData.end_suscription;
            /**
             * Fin de mapeo de la respuesta
             */
            console.log("Data to send", responseData);
            res.status(response.status).json(responseData)
        })
        .catch((err) => {
            res.status(err.status).json({
                message: err.data.message,
                error: 'El usuario no es válido o el proceso de suscripción ha caducado'
            })
        });
    } else {
        let response = {
            offline: true
        }
        res.status(200).json(response)
    }
})

module.exports = router;
