var GroupPlaceReportModel = require('../../models/GroupPlaceReportModel');
var GroupPlaceAlertModel = require('../../models/GroupPlaceAlertModel');
var GroupPlaceModel = require('../../models/GroupPlaceModel');
var GroupUserModel = require('../../models/GroupUserModel');

const { QueryTypes, Op, fn, col } = require("sequelize");
const moment = require('moment')

const { validationResult } = require('express-validator');

const controller = {};

controller.today_get = async (req, res) => {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    await GroupPlaceReportModel.count({
        where: {
            GroupFK: req.user.IdGroup,
            CreatedIn: { 
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW
            }
        }
    })
    .then(async todayReports => {
        await GroupUserModel.count({
            where: {
                GroupFK: req.user.IdGroup,
                CreatedIn: { 
                    [Op.gt]: TODAY_START,
                    [Op.lt]: NOW
                }
            }
        })
        .then(async users => {
            await GroupPlaceAlertModel.count({
                where: {
                    GroupFK: req.user.IdGroup,
                    CreatedIn: { 
                        [Op.gt]: TODAY_START,
                        [Op.lt]: NOW
                    }
                }
            })
            .then(alerts => {
                return res.status(200).send({error: false, data: {
                    today: {
                        count: todayReports,
                        alertCount: alerts,
                        users: users
                    },
                }});
            })
        })
    })
    .catch(err => {
        return res.status(500).send({error: true, message: err.message});
    })
}

var sequelize = require('../../models/db');
controller.last_24h_get = async (req, res) => {
    await sequelize.query(
        'SELECT "IdGroupPlace", "Name", "Color", (SELECT COUNT(*) FROM tbl_groups_places_reports WHERE "GroupPlaceFK" = "IdGroupPlace" AND "GroupFK" = ? AND "CreatedIn" >= NOW() - INTERVAL \'24 HOURS\') AS "reportsCount", '
        + '(SELECT COUNT(*) FROM tbl_groups_places_alerts WHERE "GroupPlaceFK" = "IdGroupPlace" AND "GroupFK" = ? AND "CreatedIn" >= NOW() - INTERVAL \'24 HOURS\') AS "alertsCount" '
        + 'FROM tbl_groups_places WHERE "GroupFK" = ?',
        {
            replacements: [
                req.user.IdGroup,
                req.user.IdGroup,
                req.user.IdGroup
            ],
            type: QueryTypes.SELECT
        }
    )
    .then(async places => {
        return res.status(200).send({ error: false, data: {places: places} });
    })
    .catch(err => {
        return res.status(500).send({error: true, message: err.message});
    })
}

controller.week_get = async (req, res) => {
    await sequelize.query(
        'SELECT "IdGroupPlace", "Name", "Color", (SELECT COUNT(*) FROM tbl_groups_places_reports WHERE "GroupPlaceFK" = "IdGroupPlace" AND "GroupFK" = ? AND "CreatedIn" >= NOW() - INTERVAL \'7 DAYS\') AS "reportsCount", '
        + '(SELECT COUNT(*) FROM tbl_groups_places_alerts WHERE "GroupPlaceFK" = "IdGroupPlace" AND "GroupFK" = ? AND "CreatedIn" >= NOW() - INTERVAL \'7 DAYS\') AS "alertsCount" '
        + 'FROM tbl_groups_places WHERE "GroupFK" = ?',
        {
            replacements: [
                req.user.IdGroup,
                req.user.IdGroup,
                req.user.IdGroup
            ],
            type: QueryTypes.SELECT
        }
    )
    .then(async places => {
        return res.status(200).send({ error: false, data: {places: places} });
    })
    .catch(err => {
        return res.status(500).send({error: true, message: err.message});
    })
}

controller.month_get = async (req, res) => {
    await sequelize.query(
        'SELECT "IdGroupPlace", "Name", "Color", (SELECT COUNT(*) FROM tbl_groups_places_reports WHERE "GroupPlaceFK" = "IdGroupPlace" AND "GroupFK" = ? AND "CreatedIn" >= NOW() - INTERVAL \'30 DAYS\') AS "reportsCount", '
        + '(SELECT COUNT(*) FROM tbl_groups_places_alerts WHERE "GroupPlaceFK" = "IdGroupPlace" AND "GroupFK" = ? AND "CreatedIn" >= NOW() - INTERVAL \'30 DAYS\') AS "alertsCount" '
        + 'FROM tbl_groups_places WHERE "GroupFK" = ?',
        {
            replacements: [
                req.user.IdGroup,
                req.user.IdGroup,
                req.user.IdGroup
            ],
            type: QueryTypes.SELECT
        }
    )
    .then(async places => {
        return res.status(200).send({ error: false, data: {places: places} });
    })
    .catch(err => {
        return res.status(500).send({error: true, message: err.message});
    })
}

module.exports = controller;