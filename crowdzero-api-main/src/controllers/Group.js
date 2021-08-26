const { Op, fn, col } = require("sequelize");
const moment = require('moment');

var UserModel = require('../models/UserModel');
var UserEmailModel = require('../models/UserEmailModel');

var GroupModel = require('../models/GroupModel');
var GroupUserModel = require('../models/GroupUserModel');
var GroupDomainModel = require('../models/GroupDomainModel');
var GroupPlaceModel = require('../models/GroupPlaceModel');
var GroupPlaceReportModel = require('../models/GroupPlaceReportModel');
var GroupPlaceAlertModel = require('../models/GroupPlaceAlertModel');

var GroupPlaceReportLikeModel =  require('../models/GroupPlaceReportLikeModel');

const { validationResult } = require('express-validator');

const controller = {};

controller.my_list_get = async (req, res) => {
    await GroupUserModel.findAll({
        where: {
            UserFK: req.user.IdUser
        },
        include: [
            {
                model: GroupModel,
                as: 'Group',
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
    .then(Groups => {
        return res.status(200).send({ error: false, data: Groups });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.search_get = async (req, res) => {
    await GroupModel.findAll({
        where: {
            Name: {
                [Op.iLike]: "%"+ req.params.search +"%"
            }
        },
        attributes: {
            exclude: [
                'Email',
                'Password',
                'Active',
                'ActivatedIn'
            ]
        }
    })
    .then(Groups => {
        return res.status(200).send({ error: false, data: Groups });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.enter_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupUserModel.findOne({
        where: {
            UserFK: req.user.IdUser,
            GroupFK: req.body.IdGroup
        }
    })
    .then(async GroupUser => {
        if (GroupUser) {
            return res.status(400).send({ error: true, message: "Já está inserido nesse grupo!" });
        }

        await GroupModel.findOne({
            where: {
                IdGroup: req.body.IdGroup
            }
        })
        .then(async Group => {
            if (!Group) {
                return res.status(400).send({ error: true, message: "Nenhum grupo encontrado com esse Id!" });
            }

            await GroupDomainModel.findAll({
                where: {
                    GroupFK: req.body.IdGroup
                }
            })
            .then(async Domains => {
                if (Domains) {
                    var DomainFound = null;
                    var UserEmailFound = null;

                    Domains.forEach(domain => {
                        if (req.user.Email.includes(domain.Domain)) {
                            if (req.user.Email.split('@')[1] == domain.Domain) {
                                DomainFound = domain;
                            }
                        }
                    });

                    if (!DomainFound) {
                        await UserEmailModel.findAll({
                            where: {
                                IdUserFK: req.user.IdUser,
                                Active: true
                            }
                        })
                        .then(UserEmails => {
                            UserEmails.forEach(userEmail => {
                                Domains.forEach(domain => {
                                    if (userEmail.Email.includes(domain.Domain)) {
                                        if (userEmail.Email.split('@')[1] == domain.Domain) {
                                            UserEmailFound = userEmail;
                                            DomainFound = domain;
                                        }
                                    }
                                });
                            });
                        })
                    }

                    if (DomainFound) {
                        await GroupUserModel.create({
                            UserFK: req.user.IdUser,
                            GroupFK: req.body.IdGroup,
                            Accepted: true,
                            GroupDomainFK: DomainFound.IdGroupDomain
                        })
                        .then(GroupUser => {
                            return res.status(200).send({ error: false, data: GroupUser });
                        })
                    } else {
                        await GroupUserModel.create({
                            UserFK: req.user.IdUser,
                            GroupFK: req.body.IdGroup,
                            Accepted: false
                        })
                        .then(GroupUser => {
                            return res.status(200).send({ error: false, data: GroupUser });
                        })
                    }
                } else {
                    await GroupUserModel.create({
                        UserFK: req.user.IdUser,
                        GroupFK: req.body.IdGroup,
                        Accepted: false
                    })
                    .then(GroupUser => {
                        return res.status(200).send({ error: false, data: GroupUser });
                    })
                }
            })
        })
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.leave_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupUserModel.findOne({
        where: {
            GroupFK: req.body.IdGroup,
            UserFK: req.user.IdUser
        }
    })
    .then(GroupUser => {
        if (!GroupUser) {
            return res.status(400).send({ error: true, message: "Não pertence a esse grupo!" });
        }

        // GroupPlaceReportModel.destroy({
        //     where: {
        //         UserFK: req.user.IdUser,
        //         GroupFK: req.body.IdGroup
        //     }
        // });

        GroupUser.destroy();

        return res.status(200).send({ error: false, message: "Saiu do grupo com sucesso!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}


controller.places_get = async (req, res) => {
    await GroupPlaceModel.findAll({
        where: {
            GroupFK: req.params.idGroup
        },
        include: {
            model: GroupPlaceAlertModel,
            as: 'Alerts',
            required: false,
            where: {
                IsFixed: false
            }
        }
    })
    .then(places => {
        return res.status(200).send({ error: false, data: places });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.place_reports_get = async (req, res) => {
    await GroupPlaceReportModel.findAll({
        where: {
            GroupFK: req.params.idGroup,
            GroupPlaceFK: req.params.idPlace
        },
        include: [
            {
                model: GroupPlaceReportLikeModel,
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
        return res.status(200).send({ error: false, data: Reports });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.place_reports_last_get = async (req, res) => {
    await GroupPlaceReportModel.findAll({
        where: {
            GroupFK: req.params.idGroup,
            GroupPlaceFK: req.params.idPlace,
            CreatedIn: {
                [Op.gte]: moment().subtract(10, 'minutes').toDate()
            }
        },
        include: [
            {
                model: GroupPlaceReportLikeModel,
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
        return res.status(200).send({ error: false, data: Reports });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.place_report_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupUserModel.findOne({
        where: {
            UserFK: req.user.IdUser,
            GroupFK: req.params.idGroup
        }
    })
    .then(async GroupUser => {
        if (!GroupUser) {
            return res.status(400).send({ error: true, message: "Não pertence a esse grupo!" });
        }
        
        const _IdPlace = req.body.idPlace
        const _Level = req.body.level;
        const _IdUser = req.user.IdUser;
    
        await GroupPlaceModel.findOne({
            where: {
                GroupFK: req.params.idGroup,
                IdGroupPlace: _IdPlace
            }
        })
        .then(async Place => {
            if (!Place) {
                return res.status(400).send({ error: true, message: "Espaço não encontrado!" });
            }

            GroupPlaceReportModel.create({
                Level: _Level,
                UserFK: _IdUser,
                GroupFK: req.params.idGroup,
                GroupPlaceFK: _IdPlace
            })
            .then(async PlaceReport => {
                if (!PlaceReport) {
                    return res.status(500).send({ error: true, message: "Não foi possível criar esse report!" });
                }
                
                await GroupPlaceAlertModel.findOne({
                    where: {
                        GroupPlaceFK: _IdPlace
                    },
                    order: [
                        [ 'CreatedIn', 'DESC' ]
                    ]
                })
                .then(async alert => {
                    if (alert && !alert.dataValues.IsFixed) {
                        GroupPlaceReportModel.findOne({
                            limit: 15,
                            attributes: [
                                [fn('count', col('Level')),'ReportsCount'],
                                [fn('avg', col('Level')),'AvgLevel']
                            ],
                            where: {
                                GroupPlaceFK: _IdPlace,
                                CreatedIn: {
                                    [Op.gte]: alert.FirstReportDateTime
                                }
                            }
                        })
                        .then(avgRes => {
                            console.log(avgRes.dataValues);
    
                            if (avgRes.dataValues.ReportsCount >= 5 && avgRes.dataValues.AvgLevel > alert.dataValues.AvgLevel) {
                                if (avgRes.dataValues.AvgLevel >= 2.5 && alert.dataValues.AvgLevel < 2.5) {
                                    alert.update({
                                        Level: 2,
                                        AvgLevel: avgRes.dataValues.AvgLevel,
                                        CreatedIn: moment().toDate()
                                    });
                                }
                            }
                        })
                    } else {
                        const _FirstReportDateTime = (alert && alert.dataValues.IsFixed) ? alert.dataValues.FixedIn : moment().subtract(30, 'minutes').toDate();
    
                        GroupPlaceReportModel.findOne({
                            limit: 15,
                            attributes: [
                                [fn('count', col('Level')),'ReportsCount'],
                                [fn('avg', col('Level')),'AvgLevel']
                            ],
                            where: {
                                GroupPlaceFK: _IdPlace,
                                CreatedIn: {
                                    [Op.gte]: _FirstReportDateTime
                                }
                            }
                        })
                        .then(avgRes => {
                            console.log(avgRes.dataValues);
    
                            if (avgRes.dataValues.ReportsCount >= 3) {
                                if (avgRes.dataValues.AvgLevel >= 1.8) {
                                    GroupPlaceAlertModel.create({
                                        FirstReportDateTime: _FirstReportDateTime,
                                        AvgLevel: 1.8,
                                        Level: 1,
                                        GroupFK: req.params.idGroup,
                                        GroupPlaceFK: _IdPlace
                                    });
                                }
                            }
                        })
                    }
    
                    return res.status(200).send({ error: false, message: "Report criado com sucesso!", report: PlaceReport });
                })
                .catch(err => {
                    return res.status(500).send({ error: true, message: err.message });
                });
            })
            .catch(err => {
                return res.status(500).send({ error: true, message: err.message });
            });
        })
        .catch(err => {
            return res.status(500).send({ error: true, message: err.message });
        });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.place_report_like_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupPlaceReportModel.findOne({
        where: {
            "IdGroupPlaceReport": req.params.IdReport,
            "GroupFK": req.params.idGroup
        }
    })
    .then(async Report => {
        if (!Report) {
            return res.status(404).send({ error: true, message: "Nenhum report foi encontrado!" });
        }

        await GroupPlaceReportLikeModel.findOne({
            where: {
                "CreatedByFK": req.user.IdUser,
                "GroupPlaceReportFK": req.params.IdReport
            }
        })
        .then(async ReportLike => {
            if (!ReportLike) {
                await GroupPlaceReportLikeModel.create({
                    IsLike: req.body.isLike,
                    CreatedByFK: req.user.IdUser,
                    GroupPlaceReportFK: req.params.IdReport
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

controller.place_report_like_delete = async (req, res) => {
    await GroupPlaceReportLikeModel.destroy({
        where: {
            "IdGroupPlaceReportLike": req.params.IdReportLike,
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