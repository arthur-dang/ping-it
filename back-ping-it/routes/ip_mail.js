var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");

var authController = require('../controllers/authcontrollers.js');

var passport = require('passport');



const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = require('../sql_config.js');

const database = require('../database_config.js');



var User = database.user;
var IP_Machine = database.ip_machine;
var IP_Dashboard = database.ip_dashboard;
var IP_Machine_Service = database.ip_machine_service;
var Service = database.service;
var Settings_warning = database.settings_warning;
var Apache_count = database.apache_count;

var warningChecker = (req, res, next) => {
    IP_Machine.findOne({
        attributes: ['id'],
        where: {
            IPmachine: req.body.IPmachine
        }
    }
    ).then((result) => {
        var id_machine = result.id;
        Service.findOne({
            attributes: ['id'],
            where: {
                service: req.body.service
            }
        }
        ).then((result) => {
            var service_id = result.id;
            IP_Machine_Service.findOne({
                attributes: ['warning'],
                where: { IPMachineId: id_machine, serviceId: service_id }
            }).then((result) => {
                if (result.warning === true) {
                    next();
                } else {
                    res.status(403).send({
                        errorMessage: 'a user is already logged in'
                    });
                }
            });
        })
    });
};
var apacheChecker = (req, res, next) => {
    if (req.body.service == 'apache') {
        IP_Machine.findOne({
            attributes: ['id'],
            where: {
                IPmachine: req.body.IPmachine
            }
        }
        ).then((result) => {
            var id_machine = result.dataValues.id;
            Settings_warning.findOne({
                attributes: ['apache','id'],
                where: { IPMachineId: id_machine }
            }).then((result) => {
              var settings_warning_id = result.id;
              var countInit = result.apache;
              Apache_count.findOne({
                attributes : ['count'],
                where : {
                  settingsWarningId : settings_warning_id
                }
              }).then((result) => {

                var countCurrent = result.count;
                if(countCurrent === 0){
                  Apache_count.update(
                    {count : countInit},
                    {where:{settingsWarningId : settings_warning_id}}
                  ).then(() => {
                    next();
                  })
                }
                else{
                    var countCurrentNew = countCurrent-1;

                  Apache_count.update(
                    {count : countCurrentNew},
                    {where:{settingsWarningId : settings_warning_id}}
                  ).then(() => {
                    res.status(403).send({
                        errorMessage: 'a user is already logged in'
                    });
                  })
                }
              })
            });
        })
    }else{
        next();
    }
};

var mongoChecker = (req, res, next) => {
    if (req.body.service == 'mongodb') {
        IP_Machine.findOne({
            attributes: ['id'],
            where: {
                IPmachine: req.body.IPmachine
            }
        }
        ).then((result) => {
            var id_machine = result.dataValues.id;
            Settings_warning.findOne({
                attributes: ['mongodb'],
                where: { IPMachineId: id_machine }
            }).then((result) => {

                if (req.body.value > result.dataValues.mongodb) {
                    next();
                } else {
                    res.status(403).send({
                        errorMessage: 'not enough to worry about'
                    });
                }
            });
        })
    }else{
        next();
    }
};

var dockerChecker = (req, res, next) => {
    if (req.body.service == 'docker') {
        IP_Machine.findOne({
            attributes: ['id'],
            where: {
                IPmachine: req.body.IPmachine
            }
        }
        ).then((result) => {
            var id_machine = result.dataValues.id;
            Settings_warning.findOne({
                attributes: ['docker'],
                where: { IPMachineId: id_machine }
            }).then((result) => {

                if (req.body.value.cpu > result.dataValues.docker.cpu) {
                    next();
                } else {
                  if (req.body.value.mem > result.dataValues.docker.mem) {
                      next();
                  }else{
                    res.status(403).send({
                        errorMessage: 'not enough to worry about'
                    });
                  }
                }
            });
        })
    }else{
        next();
    }
};





//Get the email_warning of a machine giving the ip of the machine
router.post('/getEmailOfIpMachine', authController.IsAuthenticatedByIP, function (req, res, next) {
    IP_Machine.findAll({
        attributes: ['email_warning'],
        where: {
            IPmachine: req.body.IPmachine
        }
    }).then((result) => {
        console.log(result);
        res.json(result[0].dataValues.email_warning);
    });
});

//Change the email_warning of the IP_Machine giving the new email_warning and the ip of the machine
router.put('/updateMail', authController.IsAuthenticatedByIP, function (req, res, next) {
    IP_Machine.update(
        { email_warning: req.body.email_warning },
        { where: { IPmachine: req.body.IPmachine } }
    ).then(() => {
        res.send('ok');
    })
});

router.post('/settings_warning', authController.IsAuthenticatedByIP,function (req, res, next) {
    IP_Machine.findOne({
        attributes: ['id'],
        where: {
            IPmachine: req.body.IPmachine
        }
    }
    ).then((result) => {
        var id_machine = result.id;
        Settings_warning.update(
            { [req.body.service]: req.body.value },
            { where: { IPMachineId: id_machine } }
        ).then(() => {
            if(req.body.service === 'apache'){
              Settings_warning.findOne({
                attributes:['id'],
                where:{
                  IPMachineId : id_machine
                }
              }).then((result) => {
                  var settwarnid = result.id;
                  Apache_count.findOne({
                     where : {settingsWarningId : settwarnid }
                  }).then((result) => {
                  if(result == undefined) {
                Apache_count.create({settingsWarningId : settwarnid, count : req.body.value}).then(() =>{
                  res.json();}
                )
              }else{
                Apache_count.update({ count : req.body.value},{where : {settingsWarningId : settwarnid}}).then(() =>{
                    res.json();}
                  )
              }
            });
              })
            }else{
                res.json();
            }
        });
    });
});

router.post('/setWarning', authController.IsAuthenticatedByIP,function (req, res, next) {
    IP_Machine.findOne({
        attributes: ['id'],
        where: {
            IPmachine: req.body.IPmachine
        }
    }
    ).then((result) => {
        var id_machine = result.id;
        Service.findOne({
            attributes: ['id'],
            where: {
                service: req.body.service
            }
        }
        ).then((result) => {
            var service_id = result.id;
            IP_Machine_Service.update(
                { warning: req.body.warning },
                { where: { IPMachineId: id_machine, serviceId: service_id } }
            ).then(() => {
                res.json();
            });
        })
    })
});

router.post('/getWarningSettings', authController.IsAuthenticatedByIP,function (req, res, next) {
    IP_Machine.findOne({
        attributes: ['id'],
        where: {
            IPmachine: req.body.IPmachine
        }
    }
    ).then((result) => {
      var id_machine = result.id;
      Settings_warning.findOne({
          attributes: ['docker','apache','mongodb'],
          where: { IPMachineId: id_machine }
      }).then((result) => {
        res.json({"apache":result.apache,"docker":result.docker,"mongodb":result.mongodb })
      })
    })
  });





router.post('/getWarning', authController.IsAuthenticatedByIP,function (req, res, next) {
    IP_Machine.findOne({
        attributes: ['id'],
        where: {
            IPmachine: req.body.IPmachine
        }
    }
    ).then((result) => {
        var id_machine = result.id;
        services = [];
        IP_Machine_Service.findAll({
            attributes: ['warning', 'serviceId'],
            where: { IPMachineId: id_machine }
        }).then((result) => {
            var length = result.length;
            for (i = 0; i < length; i++) {
                if (result[i].dataValues.warning === true) {
                    Service.findOne({
                        attributes: ['service'],
                        where: {
                            id: result[i].dataValues.serviceId
                        }
                    }).then((result) => {
                        // console.log({result})
                        services.push({ "service": result.service, "active": true });
                        //console.log({i})
                        if (services.length == length) {
                            res.send({ "services": services })
                        }

                    })
                }
                else {
                    Service.findOne({
                        attributes: ['service'],
                        where: {
                            id: result[i].dataValues.serviceId
                        }
                    }).then((result) => {
                        //console.log({length})
                        //console.log({result})
                        services.push({ "service": result.service, "active": false });
                        if (services.length == length) {
                            res.send({ "services": services })
                        }


                    })
                }
            }
        });

    });
});


//Send an email to the mail of an IPMachine giving the IPmachine, the msg, the token
router.post('/send',warningChecker,apacheChecker,mongoChecker,  dockerChecker,function (req, res, next) {
    //Check if the email of the token is registered
    User.findOne({
        attributes: ['email'],
        where: {
            token: req.body.token
        }
    }).then((result) => {
        var email = result.email;
        if (email === null) {
            res.status(403).send({
                errorMessage: 'not a registered agent'
            });
        }
        else {
            //Check que le requête a le bon body en fournissant le message et l'IP de la machine
            if ((req.body.hasOwnProperty('IPmachine')) && (req.body.hasOwnProperty('msg'))) {
                IP_Machine.findAll({
                    attributes: ['email_warning'],
                    where: {
                        IPmachine: req.body.IPmachine
                    }
                }).then((result) => {
                    var email = result[0].dataValues.email_warning;
                    var sujet = 'Erreur sur votre serveur ip : ' + req.body.IPmachine;
                    var msg = req.body.msg;
                    var smtpTransport = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: "pingit.mail@gmail.com",
                            pass: "1234Ping*"
                        }
                    });
                    var mail = {
                        from: "pingit.mail@gmail.com",
                        to: email,
                        subject: sujet,
                        text: msg
                    }
                    smtpTransport.sendMail(mail, function (error, response) {
                        if (error) {
                            console.log("Erreur lors de l'envoie du mail!");
                            console.log(error);
                        } else {
                            console.log("Mail envoyé avec succès!")
                        }
                        smtpTransport.close();
                    });
                    res.json(email); //Answer to the caller with the email_warning of the ip machine
                })
            } else {
                res.status(403).send({
                    errorMessage: 'ip ou message non fournit'
                });
            }
        }
    });
});




module.exports = router;
