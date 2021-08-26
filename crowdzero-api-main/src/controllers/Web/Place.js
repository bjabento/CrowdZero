var GroupPlaceModel = require('../../models/GroupPlaceModel');
var GroupPlaceReportModel = require('../../models/GroupPlaceReportModel');
var GroupPlaceAlertModel = require('../../models/GroupPlaceAlertModel');

const { QueryTypes, Op, fn, col } = require("sequelize");

const { validationResult } = require('express-validator');

const controller = {};

controller.get_get = async (req, res) => {
    await GroupPlaceModel.findOne({
        where: {
            IdGroupPlace: req.params.idGroupPlace,
            GroupFK: req.user.IdGroup
        }
    })
    .then(Place => {
        return res.status(200).json({ error: false, place: Place });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.list_get = async (req, res) => {
    await GroupPlaceModel.findAll({
        where: {
            GroupFK: req.user.IdGroup
        },
        attributes: {
            include: [
                [fn('to_char', col('tbl_groups_places.CreatedIn'), 'DD/MM/YYYY HH24:MI'), 'CreatedInFormatted']
            ]
        }
    })
    .then(Places => {
        return res.status(200).json({ error: false, data: Places });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.create_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupPlaceModel.findOne({
        where: {
            GroupFK: req.user.IdGroup,
            Name: req.body.name
        }
    })
    .then(Place => {
        if (Place) {
            return res.status(400).send({ error: true, message: "Já tem um espaço com esse nome!" });
        }
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });

    await GroupPlaceModel.create({
        Name: req.body.name,
        GroupFK: req.user.IdGroup,
        Color: "#" + Math.floor(Math.random()*16777215).toString(16)
    }).then(Place => {
        if (!Place) {
            return res.status(500).send({ error: true, message: "Não foi possível criar esse espaço!" });
        }

        return res.status(200).send({ error: false, message: "Espaço criado com sucesso!", place: Place });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.edit_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupPlaceModel.findOne({
        where: {
            GroupFK: req.user.IdGroup,
            Name: req.body.name
        }
    })
    .then(async Place => {
        if (Place && Place.IdGroupPlace != req.params.idGroupPlace) {
            return res.status(400).send({ error: true, message: "Já tem um espaço com esse nome!" });
        } else {
            await GroupPlaceModel.findOne({
                where: {
                    IdGroupPlace: req.params.idGroupPlace,
                    GroupFK: req.user.IdGroup
                }
            })
            .then(async Place => {
                await Place.update({
                    Name: req.body.name,
                }).then(updatedPlace => {
                    return res.status(200).send({ error: false, message: "Espaço editado!", place: updatedPlace });
                }).catch(err => {
                    return res.status(500).send({ error: true, message: err.message });
                });
            }).catch(err => {
                return res.status(500).send({ error: true, message: err.message });
            });
        }
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.delete_delete = async (req, res) => {
    await GroupPlaceModel.findOne({
        where: {
            GroupFK: req.user.IdGroup,
            IdGroupPlace: req.params.idGroupPlace
        }
    })
    .then(Place => {
        if (!Place) {
            return res.status(400).send({ error: true, message: "Nenhum espaço encontrado!" });
        }

        Place.destroy();
        return res.status(200).send({ error: false, message: "Espaço eliminado!" });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

var sequelize = require('../../models/db');

function sequelize_stats_select(column, tbl, level, as) {
    return ' (SELECT COUNT("'+column+'") FROM '+tbl+' WHERE "GroupPlaceFK" = ? AND "Level" = '+level+' AND d.date = to_char(date_trunc(\'day\', "CreatedIn"), \'YYYY-MM-DD\')) AS '+as+' ';
}

function sequelize_stats_select_hour(column, tbl, level, as) {
    return ' (SELECT COUNT("'+column+'") FROM '+tbl+' WHERE "GroupPlaceFK" = ? AND "Level" = '+level+' AND d.date = to_char(date_trunc(\'hour\', "CreatedIn"), \'YYYY-MM-DD HH24:MI\')) AS '+as+' ';
}

controller.stats_today_get = async (req, res) => {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    await GroupPlaceReportModel.count({
        where: {
            GroupPlaceFK: req.params.idGroupPlace,
            CreatedIn: {
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW
            }
        }
    })
    .then(async todayReports => {
        await GroupPlaceAlertModel.count({
            where: {
                GroupPlaceFK: req.params.idGroupPlace,
                CreatedIn: { 
                    [Op.gt]: TODAY_START,
                    [Op.lt]: NOW
                }
            }
        })
        .then(alerts => {
            return res.status(200).send({error: false, data: {
                today: {
                    reportCount: todayReports,
                    alertCount: alerts,
                },
            }});
        })
    })
    .catch(err => {
        return res.status(500).send({error: true, message: err.message});
    })
}

controller.stats_24h_get = async (req, res) => {
    await sequelize.query(
        'SELECT to_char(TO_TIMESTAMP(d.date, \'YYYY-MM-DD HH24:MI\'), \'DD/MM HH24:MI\') as "date", '
        + sequelize_stats_select_hour("IdGroupPlaceReport", "tbl_groups_places_reports", 1, "\"countReports1\",")
        + sequelize_stats_select_hour("IdGroupPlaceReport", "tbl_groups_places_reports", 2, "\"countReports2\",")
        + sequelize_stats_select_hour("IdGroupPlaceReport", "tbl_groups_places_reports", 3, "\"countReports3\",")

        + sequelize_stats_select_hour("IdGroupPlaceAlert", "tbl_groups_places_alerts", 1, "\"countAlerts1\",")
        + sequelize_stats_select_hour("IdGroupPlaceAlert", "tbl_groups_places_alerts", 2, "\"countAlerts2\"")
        + 'FROM (SELECT to_char(offs, \'YYYY-MM-DD HH24:MI\') AS date FROM generate_series(date_trunc(\'hour\', now()) - \'1 day\'::interval, date_trunc(\'hour\', now()), \'1 hour\'::interval) AS offs) d '
        + 'GROUP BY d.date '
        + 'ORDER BY d.date ASC',
        {
            replacements: [
                req.params.idGroupPlace,
                req.params.idGroupPlace,
                req.params.idGroupPlace,
                req.params.idGroupPlace,
                req.params.idGroupPlace,
            ],
            type: QueryTypes.SELECT
        }
    )
    .then(async ress => {
        return res.status(200).send({ error: false, data: ress });
    })
    .catch(err => {
        console.log(err);
        return res.status(500).send({error: true, message: err.message});
    })
}

controller.stats_week_get = async (req, res) => {
    await sequelize.query(
        'SELECT to_char(TO_TIMESTAMP(d.date, \'YYYY-MM-DD HH24:MI\'), \'DD/MM\') as "date", '
        + sequelize_stats_select("IdGroupPlaceReport", "tbl_groups_places_reports", 1, "\"countReports1\",")
        + sequelize_stats_select("IdGroupPlaceReport", "tbl_groups_places_reports", 2, "\"countReports2\",")
        + sequelize_stats_select("IdGroupPlaceReport", "tbl_groups_places_reports", 3, "\"countReports3\",")

        + sequelize_stats_select("IdGroupPlaceAlert", "tbl_groups_places_alerts", 1, "\"countAlerts1\",")
        + sequelize_stats_select("IdGroupPlaceAlert", "tbl_groups_places_alerts", 2, "\"countAlerts2\"")
        + 'FROM (SELECT to_char(DATE_TRUNC(\'day\', (CURRENT_DATE - offs)), \'YYYY-MM-DD\') AS date FROM generate_series(0, 7, 1) AS offs) d '
        + 'GROUP BY d.date '
        + 'ORDER BY d.date ASC',
        {
            replacements: [
                req.params.idGroupPlace,
                req.params.idGroupPlace,
                req.params.idGroupPlace,
                req.params.idGroupPlace,
                req.params.idGroupPlace,
            ],
            type: QueryTypes.SELECT
        }
    )
    .then(async ress => {
        return res.status(200).send({ error: false, data: ress });
    })
    .catch(err => {
        console.log(err);
        return res.status(500).send({error: true, message: err.message});
    })
}

controller.stats_month_get = async (req, res) => {
    await sequelize.query(
        'SELECT to_char(TO_TIMESTAMP(d.date, \'YYYY-MM-DD HH24:MI\'), \'DD/MM\') as "date", '
        + sequelize_stats_select("IdGroupPlaceReport", "tbl_groups_places_reports", 1, "\"countReports1\",")
        + sequelize_stats_select("IdGroupPlaceReport", "tbl_groups_places_reports", 2, "\"countReports2\",")
        + sequelize_stats_select("IdGroupPlaceReport", "tbl_groups_places_reports", 3, "\"countReports3\",")

        + sequelize_stats_select("IdGroupPlaceAlert", "tbl_groups_places_alerts", 1, "\"countAlerts1\",")
        + sequelize_stats_select("IdGroupPlaceAlert", "tbl_groups_places_alerts", 2, "\"countAlerts2\"")
        + 'FROM (SELECT to_char(DATE_TRUNC(\'day\', (CURRENT_DATE - offs)), \'YYYY-MM-DD\') AS date FROM generate_series(0, 30, 1) AS offs) d '
        + 'GROUP BY d.date '
        + 'ORDER BY d.date ASC',
        {
            replacements: [
                req.params.idGroupPlace,
                req.params.idGroupPlace,
                req.params.idGroupPlace,
                req.params.idGroupPlace,
                req.params.idGroupPlace,
            ],
            type: QueryTypes.SELECT
        }
    )
    .then(async ress => {
        return res.status(200).send({ error: false, data: ress });
    })
    .catch(err => {
        return res.status(500).send({error: true, message: err.message});
    })
}

module.exports = controller;