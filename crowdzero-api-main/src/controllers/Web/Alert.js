var GroupPlaceAlertModel = require('../../models/GroupPlaceAlertModel');
var GroupPlaceModel = require('../../models/GroupPlaceModel');

const { fn, col } = require("sequelize");
const moment = require('moment');

const controller = {};

controller.list_get = async (req, res) => {
    await GroupPlaceAlertModel.findAll({
        attributes: {
            include: [
                [fn('to_char', col('tbl_groups_places_alerts.CreatedIn'), 'DD/MM HH24:MI'), 'CreatedInFormatted']
            ]
        },
        where: {
            "IsFixed": req.params.alertType == 1,
            "GroupFK": req.user.IdGroup
        },
        include: [
            {
                model: GroupPlaceModel,
                as: 'GroupPlace'
            }
        ],
        order: [
            ['IdGroupPlaceAlert', 'DESC']
        ]
    })
    .then(alerts => {
        return res.status(200).send({error: false, data: alerts});
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.fix_get = async (req, res) => {
    await GroupPlaceAlertModel.findOne({
        where: {
            "IdGroupPlaceAlert": req.params.idGroupPlaceAlert,
            "IsFixed": false,
            "GroupFK": req.user.IdGroup
        }
    })
    .then(async alert => {
        if (!alert) {
            return res.status(400).send({error: true, message: "Nenhum alerta encontrado!"});
        }

        await alert.update({
            IsFixed: true,
            FixedIn: moment().toDate()
        });

        return res.status(200).send({error: false, message: "Alerta resolvido!"});
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

module.exports = controller;