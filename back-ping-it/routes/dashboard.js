var express = require('express');
var router = express.Router();



const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = require('../sql_config.js');

const database = require('../database_config.js');


var IP_Machine = database.ip_machine;
var IP_Dashboard = database.ip_dashboard;


//Récupère le dashboard selon l'IP machine donné
router.post('/getDashboard', function(req, res, next) {
    IP_Machine.findAll({
        attributes: ['id'],
        where: {
            IPmachine: req.body.IPmachine
        }
    }).then( (result) => {

        IP_Dashboard.findAll({
            attributes: ['dashboard'],
            where: {
                IPmachineId: result[0].dataValues.id
            }
        }).then( (result) => {
            if(!(result[0]=== undefined)) {
                res.json(result[0].dataValues.dashboard.dash); //Renvoie la colonne dashboard qui est un json contenant l'array à la clé dash
            } else {

                console.log("dashboard inexistant pour cette machine");
                 res.send([]);
            }
        })
    })
});

//Met à jour le Dashboard d'une IPmachine donnée, en mySQL le dashboard est stocké en json et donc doit être en json dans le req.body
router.post('/updateDashboard', function(req,res,next) {
    IP_Machine.findAll({
        attributes: ['id'],
        where: {
            IPmachine: req.body.IPmachine
        }
    }).then( (result) => {
        const machineId = result[0].dataValues.id;
        IP_Dashboard.findAll({
            attributes: ['dashboard'],
            where: {
                IPmachineId: machineId
            }
        }).then( (result) => {
            //Crée le dashboard si existe pas
            if(result.length===0){
                console.log("crée");
                //req.body.dashboard est un array, crée dans mysql un record avec la colonne dashboard qui est un json contenant cet array à la clé dash
                IP_Dashboard.create({
                    dashboard: { dash: req.body.dashboard },
                    IPmachineId: machineId  //Problème met nul pour IPmachineId
                })
                    .then( ()=>{
                        console.log('creation dashboard');
                        res.send({flag: true});
                    });
            //Update Dashboard sinon
            } else {
                console.log("update");
                IP_Dashboard.update(
                    { dashboard: { dash: req.body.dashboard } },
                    { where: { IPmachineId : machineId } }
                ).then( () => {
                    console.log('update dashboard');
                    res.send({flag: true});
                });
            }
        })
    });
});

module.exports = router;
