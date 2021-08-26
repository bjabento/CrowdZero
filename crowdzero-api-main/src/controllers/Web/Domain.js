var GroupDomainModel = require('../../models/GroupDomainModel');

const { fn, col } = require("sequelize");

const { validationResult } = require('express-validator');

const controller = {};

controller.get_get = async (req, res) => {
    await GroupDomainModel.findOne({
        where: {
            IdGroupDomain: req.params.idGroupDomain,
            GroupFK: req.user.IdGroup
        }
    })
    .then(Domain => {
        return res.status(200).json({ error: false, domain: Domain });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.list_get = async (req, res) => {
    await GroupDomainModel.findAll({
        where: {
            GroupFK: req.user.IdGroup
        },
        attributes: {
            include: [
                [fn('to_char', col('tbl_group_domains.CreatedIn'), 'DD/MM/YYYY HH24:MI'), 'CreatedInFormatted']
            ]
        }
    })
    .then(Groups => {
        return res.status(200).json({ error: false, data: Groups });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.create_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupDomainModel.findOne({
        where: {
            GroupFK: req.user.IdGroup,
            Domain: req.body.domain
        }
    })
    .then(Domain => {
        if (Domain) {
            return res.status(400).send({ error: true, message: "Já tem um dominio igual associado!" });
        }
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });

    await GroupDomainModel.create({
        Domain: req.body.domain,
        GroupFK: req.user.IdGroup
    }).then(Domain => {
        if (!Domain) {
            return res.status(500).send({ error: true, message: "Não foi possível criar esse dominio!" });
        }

        return res.status(200).send({ error: false, message: "Dominio criado com sucesso!", domain: Domain });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.edit_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupDomainModel.findOne({
        where: {
            GroupFK: req.user.IdGroup,
            Domain: req.body.domain
        }
    })
    .then(Domain => {
        if (Domain && Domain.IdGroupDomain == req.params.IdGroupDomain) {
            return res.status(400).send({ error: true, message: "Já tem um dominio igual associado!" });
        }
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });

    await GroupDomainModel.findOne({
        where: {
            IdGroupDomain: req.params.idGroupDomain,
            GroupFK: req.user.IdGroup
        }
    })
    .then(async Domain => {
        await Domain.update({
            Domain: req.body.domain
        }).then(updatedDomain => {
            return res.status(200).send({ error: false, message: "Dominio editado!", domain: updatedDomain });
        }).catch(err => {
            return res.status(500).send({ error: true, message: err.message });
        });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.delete_delete = async (req, res) => {
    await GroupDomainModel.findOne({
        where: {
            GroupFK: req.user.IdGroup,
            IdGroupDomain: req.params.idGroupDomain
        }
    })
    .then(Domain => {
        if (!Domain) {
            return res.status(400).send({ error: true, message: "Nenhum dominio encontrado!" });
        }

        Domain.destroy();
        return res.status(200).send({ error: false, message: "Dominio eliminado!" });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

module.exports = controller;