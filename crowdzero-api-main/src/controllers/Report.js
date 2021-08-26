const moment = require('moment')
const { Op, literal } = require("sequelize");

var ReportModel = require('../models/ReportModel');
var ReportLikeModel = require('../models/ReportLikeModel');

var GroupPlaceReportModel = require('../models/GroupPlaceReportModel');
var GroupPlaceReportLikeModel = require('../models/GroupPlaceReportLikeModel');

var UserModel = require('../models/UserModel');

const { validationResult } = require('express-validator');

const controller = {};

controller.create_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    const _Location = { type: 'Point', coordinates: [req.body.latitude, req.body.longitude]};
    const _Level = req.body.level;
    const _IdUser = req.user.IdUser;

    await ReportModel.create({
        Location: _Location,
        Level: _Level,
        CreatedByFK: _IdUser
    }).then(Report => {
        if (!Report) {
            return res.status(500).send({ error: true, message: "Não foi possível criar esse report!" });
        }

        return res.status(200).send({ error: false, message: "Report criado com sucesso!", report: Report });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

// 
GetPoints = (IdUser) => {
    var _Points = 0;

    ReportModel.findAll({
        where: {
            CreatedByFK: IdUser
        },
        include: [
            {
                model: ReportLikeModel,
                as: 'Likes'
            }
        ]
    })
    .then(Reports => {
        var C_Likes = 0;

        Reports.forEach((report) => {
            report.Likes.forEach((like) => {
                if (like.IsLike) {
                    C_Likes++;
                } else {
                    C_Likes--;
                }
            })
        });

        GroupPlaceReportModel.findAll({
            where: {
                UserFK: IdUser
            },
            include: [
                {
                    model: GroupPlaceReportLikeModel,
                    as: 'Likes'
                }
            ]
        })
        .then(GroupReports => {
            GroupReports.forEach((report) => {
                report.Likes.forEach((like) => {
                    if (like.IsLike) {
                        C_Likes++;
                    } else {
                        C_Likes--;
                    }
                })
            });
        })

        _Points = Math.floor(C_Likes / 2);
    })

    return _Points;
}

controller.list_get = async (req, res) => {
    await ReportModel.findAll({
        where: {
            CreatedIn: {
                [Op.gte]: moment().subtract(10, 'minutes').toDate()
            }
        },
        include: [
            {
                model: ReportLikeModel,
                as: 'Likes',
                required: false,
                where: {
                    CreatedByFK: req.user.IdUser
                }
            },
            {
                model: UserModel,
                as: 'User',
                attributes: {
                    exclude: [
                        'Email',
                        'Password',
                        'Active',
                        'ActivatedIn'
                    ]
                }
            }
        ]
    })
    .then(Reports => {
        Reports.forEach((report) => {
            report.User.Points = GetPoints(report.User.IdUser);
        })

        return res.status(200).json({ error: false, data: Reports });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.list_location_get = async (req, res) => {
    // await sequelize.query(
    //     'SELECT * '
    //     + 'FROM tbl_reports '
    //     + 'WHERE ST_DistanceSphere("Location", ST_MakePoint(?, ?)) <= 200',
    //     {
    //         replacements: [
    //             req.params.latitude,
    //             req.params.longitude
    //         ],
    //         type: QueryTypes.SELECT
    //     }
    // )

    if (req.params.isLastMinutes == 0) {
        var _where = {
            [Op.and]: [
                literal('ST_DistanceSphere("Location", ST_MakePoint('+req.params.latitude+', '+req.params.longitude+')) <= 200')
            ]
        }
    } else {
        var _where = {
            [Op.and]: [
                literal('ST_DistanceSphere("Location", ST_MakePoint('+req.params.latitude+', '+req.params.longitude+')) <= 200')
            ],
            CreatedIn: {
                [Op.gte]: moment().subtract(10, 'minutes').toDate()
            }
        }
    }

    await ReportModel.findAll({
        where: _where,
        include: [
            {
                model: UserModel,
                as: 'User',
                attributes: [
                    'IdUser', 'Name'
                ]
            },
            {
                model: ReportLikeModel,
                as: 'Likes',
                required: false,
                where: {
                    CreatedByFK: req.user.IdUser
                }
            }
        ]
    })
    .then(async ress => {
        return res.status(200).send({ error: false, data: ress });
    })
    .catch(err => {
        return res.status(500).send({error: true, message: err.message});
    })
}

controller.like_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await ReportModel.findOne({
        where: {
            "IdReport": req.params.IdReport
        }
    })
    .then(async Report => {
        if (!Report) {
            return res.status(404).send({ error: true, message: "Nenhum report foi encontrado!" });
        }

        await ReportLikeModel.findOne({
            where: {
                "CreatedByFK": req.user.IdUser,
                "ReportFK": req.params.IdReport
            }
        })
        .then(async ReportLike => {
            if (!ReportLike) {
                await ReportLikeModel.create({
                    IsLike: req.body.isLike,
                    CreatedByFK: req.user.IdUser,
                    ReportFK: req.params.IdReport
                }).then(_ReportLike => {
                    if (!_ReportLike) {
                        return res.status(500).send({ error: true, message: "Não foi possível criar o like!" });
                    }
            
                    return res.status(200).send({ error: false, message: "Like criado!", like: _ReportLike });
                }).catch(err => {
                    return res.status(500).send({ error: true, message: err.message });
                });
            } else {
                await ReportLike.update({
                    IsLike: req.body.isLike
                }).then(updatedReportLike => {
                    if (!updatedReportLike) {
                        return res.status(500).send({ error: true, message: "Não foi possível editar o like!" });
                    }

                    return res.status(200).send({ error: true, message: "Like editado!", like: updatedReportLike });
                }).catch(err => {
                    return res.status(500).send({ error: true, message: err.message });
                });
            }
        }).catch(err => {
            return res.status(500).send({ error: true, message: err.message });
        });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.like_delete = async (req, res) => {
    await ReportLikeModel.destroy({
        where: {
            "IdReportLike": req.params.IdReportLike,
            "CreatedByFK": req.user.IdUser
        }
    })
    .then(Count => {
        if (!Count) {
            return res.status(404).send({ error: true, message: "Nenhum like foi encontrado!" });
        }

        return res.status(200).send({ error: true, message: "Like eliminado!" });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

module.exports = controller;