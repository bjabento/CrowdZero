const { Op } = require("sequelize");
const moment = require('moment')
const bcrypt = require('bcrypt');

var UserModel = require('../models/UserModel');
var UserEmailModel = require('../models/UserEmailModel');
var UserFavourite = require('../models/UserFavourite');

var ReportModel = require('../models/ReportModel');
var ReportLikeModel = require('../models/ReportLikeModel');

var GroupPlaceReportModel = require('../models/GroupPlaceReportModel');
var GroupPlaceReportLikeModel = require('../models/GroupPlaceReportLikeModel');

const JwtHelper = require('../helpers/JwtHelper');
const nodemailer = require('nodemailer');
const MailConfig = require('../configs/MailConfig');

const { validationResult } = require('express-validator');

const controller = {};

controller.email_list_get = async (req, res) => {
    await UserEmailModel.findAll({
        where: {
            IdUserFK: req.user.IdUser
        }
    })
    .then((Emails) => {
        return res.status(200).send({ error: false, data: Emails });
    })
    .catch((err) => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.email_confirm_get = async (req, res) => {
    var decodedJwt = JwtHelper.decode(req.params.jwt);

    if (!decodedJwt) {
        return res.status(400).json({ error: true, message: "Token inválido!" });
    }

    await UserEmailModel.findOne({
        where: {
            Email: decodedJwt.Email
        }
    })
    .then(userEmail => {
        userEmail.update({
            Active: true
        })

        return res.status(200).send({ error: false, message: "Email ativado!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.email_link_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await UserModel.findOne({
        where: {
            Email: req.body.email
        }
    })
    .then(async (User) => {
        if (User) {
            return res.status(400).send({ error: true, message: "Esse email já está a ser usado!" });
        }

        await UserEmailModel.findOne({
            where: {
                Email: req.body.email
            }
        })
        .then(async (UserEmail) => {
            if (UserEmail) {
                return res.status(400).send({ error: true, message: "Esse email já está a ser usado!" });
            }
    
            await UserEmailModel.create({
                Email: req.body.email,
                Active: false,
                IdUserFK: req.user.IdUser
            })
            .then((_UserEmail) => {
                if (_UserEmail) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: MailConfig.Email,
                            pass: MailConfig.Password
                        }
                    });
            
                    var mailOptions = {
                        from: MailConfig.Email,
                        to: req.body.email,
                        subject: 'CrowdZero Account Confirmation',
                        text: 'Confirmation Link: ' + MailConfig.UrlForConfirmation2 + JwtHelper.encode({ "Email": req.body.email })
                    };
            
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    return res.status(200).send({ error: false, message: "Email associado!" });
                }
    
                return res.status(500).send({ error: true, message: "Não foi possível associar esse email!" });
            })
            .catch((err) => {
                return res.status(500).send({ error: true, message: err.message });
            })
        })
        .catch((err) => {
            return res.status(500).send({ error: true, message: err.message });
        })
    })
    .catch((err) => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.email_delete_delete = async (req, res) => {
    const _IdUserEmail = req.params.idUserEmail;

    await UserEmailModel.findOne({
        where: {
            IdUserEmail: _IdUserEmail
        }
    })
    .then(UserEmail => {
        if (!UserEmail) {
            return res.status(404).send({ error: true, message: "Nenhum email encontrado!" });
        }

        UserEmail.destroy();

        return res.status(200).send({ error: false, message: "Email eliminado!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.profile_get = async (req, res) => {
    var _Points = 0;
    var _Reports = 0;

    await UserModel.findOne({
        where: {
            IdUser: req.user.IdUser
        }
    })
    .then(async user => {
        await ReportModel.findAll({
            where: {
                CreatedByFK: req.user.IdUser
            },
            include: [
                {
                    model: ReportLikeModel,
                    as: 'Likes'
                }
            ]
        })
        .then(async Reports => {
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
    
            await GroupPlaceReportModel.findAll({
                where: {
                    UserFK: req.user.IdUser
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
            _Reports = Reports.length;
    
            return res.status(200).send({ error: false, data: {
                Name: user.Name,
                Avatar: user.Avatar,
                Points: _Points,
                Reports: _Reports
            } });
        })
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.profile_put = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await UserModel.findOne({
        where: {
            IdUser: req.user.IdUser
        }
    })
    .then(user => {
        user.update({
            Name: req.body.name
        })

        return res.status(200).send({ error: false, message: "Perfil editado!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.avatar_put = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await UserModel.findOne({
        where: {
            IdUser: req.user.IdUser
        }
    })
    .then(user => {
        user.update({
            Avatar: req.body.avatar
        })

        return res.status(200).send({ error: false, message: "Avatar editado!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.stats_week_get = async (req, res) => {
    var _Points = 0;
    var _Reports = 0;
    var _LikesReceived = 0;
    var _LikesGiven = 0;

    await ReportModel.findAll({
        where: {
            CreatedByFK: req.user.IdUser,
            CreatedIn: {
                [Op.gte]: moment().subtract(7, 'days').toDate()
            }
        },
        include: [
            {
                model: ReportLikeModel,
                as: 'Likes'
            }
        ]
    })
    .then(async Reports => {
        var C_Likes = 0;

        Reports.forEach((report) => {
            report.Likes.forEach((like) => {
                _LikesReceived++;

                if (like.IsLike) {
                    C_Likes++;
                } else {
                    C_Likes--;
                }
            })
        });

        await GroupPlaceReportModel.findAll({
            where: {
                UserFK: req.user.IdUser,
                CreatedIn: {
                    [Op.gte]: moment().subtract(7, 'days').toDate()
                }
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
                    _LikesReceived++;

                    if (like.IsLike) {
                        C_Likes++;
                    } else {
                        C_Likes--;
                    }
                })
            });
        })

        await ReportLikeModel.findAll({
            where: {
                CreatedByFK: req.user.IdUser,
                CreatedIn: {
                    [Op.gte]: moment().subtract(7, 'days').toDate()
                }
            }
        })
        .then(Likes => {
            _LikesGiven += Likes.length;
        })

        await GroupPlaceReportLikeModel.findAll({
            where: {
                CreatedByFK: req.user.IdUser,
                CreatedIn: {
                    [Op.gte]: moment().subtract(7, 'days').toDate()
                }
            }
        })
        .then(Likes => {
            _LikesGiven += Likes.length;
        })

        _Points = Math.floor(C_Likes / 2);
        _Reports = Reports.length;

        return res.status(200).send({ error: false, data: {
            Points: _Points,
            Reports: _Reports,
            LikesReceived: _LikesReceived,
            LikesGiven: _LikesGiven
        } });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.stats_month_get = async (req, res) => {
    var _Points = 0;
    var _Reports = 0;
    var _LikesReceived = 0;
    var _LikesGiven = 0;

    await ReportModel.findAll({
        where: {
            CreatedByFK: req.user.IdUser,
            CreatedIn: {
                [Op.gte]: moment().subtract(1, 'months').toDate()
            }
        },
        include: [
            {
                model: ReportLikeModel,
                as: 'Likes'
            }
        ]
    })
    .then(async Reports => {
        var C_Likes = 0;

        Reports.forEach((report) => {
            report.Likes.forEach((like) => {
                _LikesReceived++;

                if (like.IsLike) {
                    C_Likes++;
                } else {
                    C_Likes--;
                }
            })
        });

        await GroupPlaceReportModel.findAll({
            where: {
                UserFK: req.user.IdUser,
                CreatedIn: {
                    [Op.gte]: moment().subtract(1, 'months').toDate()
                }
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
                    _LikesReceived++;

                    if (like.IsLike) {
                        C_Likes++;
                    } else {
                        C_Likes--;
                    }
                })
            });
        })

        await ReportLikeModel.findAll({
            where: {
                CreatedByFK: req.user.IdUser,
                CreatedIn: {
                    [Op.gte]: moment().subtract(1, 'months').toDate()
                }
            }
        })
        .then(Likes => {
            _LikesGiven += Likes.length;
        })

        await GroupPlaceReportLikeModel.findAll({
            where: {
                CreatedByFK: req.user.IdUser,
                CreatedIn: {
                    [Op.gte]: moment().subtract(1, 'months').toDate()
                }
            }
        })
        .then(Likes => {
            _LikesGiven += Likes.length;
        })

        _Points = Math.floor(C_Likes / 2);
        _Reports = Reports.length;

        return res.status(200).send({ error: false, data: {
            Points: _Points,
            Reports: _Reports,
            LikesReceived: _LikesReceived,
            LikesGiven: _LikesGiven
        } });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.stats_always_get = async (req, res) => {
    var _Points = 0;
    var _Reports = 0;
    var _LikesReceived = 0;
    var _LikesGiven = 0;

    await ReportModel.findAll({
        where: {
            CreatedByFK: req.user.IdUser
        },
        include: [
            {
                model: ReportLikeModel,
                as: 'Likes'
            }
        ]
    })
    .then(async Reports => {
        var C_Likes = 0;

        Reports.forEach((report) => {
            report.Likes.forEach((like) => {
                _LikesReceived++;

                if (like.IsLike) {
                    C_Likes++;
                } else {
                    C_Likes--;
                }
            })
        });

        await GroupPlaceReportModel.findAll({
            where: {
                UserFK: req.user.IdUser
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
                    _LikesReceived++;

                    if (like.IsLike) {
                        C_Likes++;
                    } else {
                        C_Likes--;
                    }
                })
            });
        })

        await ReportLikeModel.findAll({
            where: {
                CreatedByFK: req.user.IdUser
            }
        })
        .then(Likes => {
            _LikesGiven += Likes.length;
        })

        await GroupPlaceReportLikeModel.findAll({
            where: {
                CreatedByFK: req.user.IdUser
            }
        })
        .then(Likes => {
            _LikesGiven += Likes.length;
        })

        _Points = Math.floor(C_Likes / 2);
        _Reports = Reports.length;

        return res.status(200).send({ error: false, data: {
            Points: _Points,
            Reports: _Reports,
            LikesReceived: _LikesReceived,
            LikesGiven: _LikesGiven
        } });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.password_change_put = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await UserModel.findOne({
        where: {
            IdUser: req.user.IdUser
        }
    })
    .then(user => {
        bcrypt.compare(req.body.password, user.Password, (error, match) => {
            if (error) return res.status(500).json(error);

            if (match) {
                user.update({
                    Password: bcrypt.hashSync(req.body.new_password, 8)
                })

                return res.status(200).json({ error: false, message: "Password alterada!" });
            }

            return res.status(400).json({ error: true, message: "Password incorreta!" });
        });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.favourite_list_get = async (req, res) => {
    await UserFavourite.findAll({
        where: {
            UserFK: req.user.IdUser
        }
    })
    .then(favourites => {
        return res.status(200).send({ error: false, data: favourites });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.favourite_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    const _Location = { type: 'Point', coordinates: [req.body.latitude, req.body.longitude]};

    UserFavourite.create({
        UserFK: req.user.IdUser,
        Location: _Location
    })

    return res.status(200).send({ error: false, message: "Favorito criado!" });
}

controller.favourite_delete = async (req, res) => {
    await UserFavourite.destroy({
        where: {
            UserFK: req.user.IdUser,
            IdUserFavourite: req.params.idUserFavourite
        }
    })
    .then(count => {
        if (!count) {
            return res.status(404).send({ error: true, message: "Nenhum favorito encontrado!" });
        }

        return res.status(200).send({ error: true, message: "Favorito eliminado!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

module.exports = controller;