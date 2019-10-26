var express = require('express');
var router = express.Router();





const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = require('../sql_config.js');

const database = require('../database_config.js');

var authController = require('../controllers/authcontrollers.js');


var Service = database.service;
var User = database.user;
var IP_Machine = database.ip_machine;
var IP_Dashboard = database.ip_dashboard;
var Metrique = database.metrique;
var IP_Machine_Service = database.ip_machine_service;
var Metrique_Service = database.metrique_service;
var Docker_Container = database.docker_container;
var IP_Machine_Docker_Container = database.ip_machine_docker_container;
var Settings_warning = database.settings_warning;
var Apache_count = database.apache_count;

var ajoutIPChecker = (req, res, next) => {
  User.findOne({
    attributes: ['id'],
    where: {
      token: req.body.token
    }
  }).then((result) => {
    if(result==null){ req.connection.destroy();res.status(401).send({ errorMessage: 'trying to steal someone else machine is not good' });  }
    else{
      var email_id = result.id;
   
      IP_Machine.findOne({
        attributes: ['userId'],
        where: {
          IPmachine: req.body.IPmachine
        }
      }).then((result) => {
        if(result==null) next();
        
        var email_machine_id = result.dataValues.userId;
       
        if(email_id == email_machine_id){
          next();
        }else{
         
          req.connection.destroy();
          res.status(401).send({ errorMessage: 'trying to steal someone else machine is not good' })
  
         
        }
      })
    }
   
  })

};

router.post('/getMetrique_apache',authController.IsAuthenticatedByIP ,function(req,res,next){
  Service.findAll({
    attributes: ['id'],
    where: {
      service: req.body.service
      }
    }).then(result => {
      Metrique_Service.findAll({
        attributes: ['metriqueId'],
        where: {
          serviceId: result[0].dataValues.id
          }
      }).then(result => {
        met = [];
        for(i=0;i<result.length;i++) {
          met.push(result[i].dataValues.metriqueId);
        };
        Metrique.findAll({
          attributes: ['heure','metrique'],
          where: {
            IPmachine: req.body.IPmachine,
            id: met,
            date: req.body.jour,
            heure: {
              [Op.between]: [req.body.heure_debut, req.body.heure_fin]
            }
          }
        }).then(result => {
          data = [];
          for(i = 0; i < result.length; i++) {
            var date = new Date(req.body.jour+'T'+result[i].dataValues.heure).getTime();
            var metr = result[i].dataValues.metrique;
            data.push({'x':date,'y': metr[req.body.metrique]});
            };
          res.json({"id":req.body.id, "data": data});
        })
      })
    })
});

router.post('/getMetrique_mongodb',authController.IsAuthenticatedByIP,function(req,res,next){
  Service.findAll({
    attributes: ['id'],
    where: {
      service: req.body.service
      }
    }).then(result => {
      Metrique_Service.findAll({
        attributes: ['metriqueId'],
        where: {
          serviceId: result[0].dataValues.id
          }
      }).then(result => {
        met = [];
        for(i=0;i<result.length;i++) {
          met.push(result[i].dataValues.metriqueId);
        };
        Metrique.findAll({
          attributes: ['heure','metrique'],
          where: {
            IPmachine: req.body.IPmachine,
            id: met,
            date: req.body.jour,
            heure: {
              [Op.between]: [req.body.heure_debut, req.body.heure_fin]
            }
          }
        }).then(result => {
          data = [];
          for(i = 0; i < result.length; i++) {
            var date = new Date(req.body.jour+'T'+result[i].dataValues.heure).getTime();
            var metr = result[i].dataValues.metrique;
            data.push({'x':date,'y': metr[req.body.metrique]});
            };
          res.json({"id":req.body.id, "data": data});
        })
      })
    })
});

router.post('/getMetrique_docker',authController.IsAuthenticatedByIP,function(req,res,next){
  Service.findAll({
    attributes: ['id'],
    where: {
      service: req.body.service
      }
    }).then(result => {
      Metrique_Service.findAll({
        attributes: ['metriqueId'],
        where: {
          serviceId: result[0].dataValues.id
          }
      }).then(result => {
        met = [];
        for(i=0;i<result.length;i++) {
          met.push(result[i].dataValues.metriqueId);
        };
        Metrique.findAll({
          attributes: ['heure','metrique'],
          where: {
            IPmachine: req.body.IPmachine,
            id: met,
            date: req.body.jour,
            heure: {
              [Op.between]: [req.body.heure_debut, req.body.heure_fin]
            }
          }
        }).then(result => {
          data = [];
          dataCPU = [];
          dataMEM = [];
          for(i = 0; i < result.length; i++) {
            var date = new Date(req.body.jour+'T'+result[i].dataValues.heure).getTime();
            var metr = result[i].dataValues.metrique;
            if(metr.Container_Id === req.body.metrique){
              dataCPU.push({'x':date,'y': metr.Cpu});
              dataMEM.push({'x':date,'y': metr.Mem});
              }
            };
          data.push({"type":"cpu","data":dataCPU});
          data.push({"type":"mem","data":dataMEM});
          res.json({"id":req.body.id, "data": data});
        })
      })
    })
});

//Ajoute une machine à un utilisateur en donnant son token de user, l'ip machine, le nom machine et l'email à avertir
router.post('/ajoutIP', ajoutIPChecker,function(req, res, next) {

  User.findOne({
    attributes: ['email'],
    where: {
      token: req.body.token
    }
  }).then((result) => {

      if(result.token === null) {
          res.status(403).send({
          errorMessage: 'not a registered agent'
          });
      }
      else {

        User.findAll({
          attributes: ['id'],
          where: {
          email: result.email
          }
        }).then((result)=> {

        let idemail = result[0].dataValues.id;
      IP_Machine.findAll({
        attributes: ['IPmachine'],
        where: {
        IPmachine: req.body.IPmachine
      }
    }).then(result => {
      if(result[0] === undefined) {
        IP_Machine.create(

            {    IPmachine: req.body.IPmachine,
              nom_machine: req.body.nom_machine,
              email_warning: req.body.email_warning,
              userId: idemail,}


        ).then(() =>

        IP_Machine.findAll({
          attributes: ['id'],
          where: {
          IPmachine: req.body.IPmachine
        }
        }).then((result) => {
          let IPmachineId = result[0].dataValues.id;
        IP_Machine_Service.destroy({
          attributes: ['serviceId'],

          where: {

          IPMachineId: result[0].dataValues.id
        }
      });
      Settings_warning.create({
         IPMachineId : result[0].dataValues.id
      }).then(() => {
        Settings_warning.findOne({
          attributes:['id'],
          where:{
            IPMachineId : result[0].dataValues.id
          }
        }).then((result) => {
          Apache_count.create({settingsWarningId : result.id})
        });
          if(!(req.body.service=== null )){
            for(i=0; i < req.body.service.length; i++) {
              if(req.body.service[i] === 'docker') {
                IP_Machine_Docker_Container.create({
                  IPMachineId: IPmachineId
                });
                //console.log("if")
              }
              Promise.all([IP_Machine.findAll({
                where: {
                IPmachine: req.body.IPmachine
              }
            }), Service.findAll({
              where: {
              service: req.body.service[i]
            }
            })])
                  .then(([IPmachine, service]) => {
                  let Ipid=IPmachine[0].dataValues.id; let  Sid=service[0].dataValues.id;
                  IP_Machine_Service.create({IPMachineId: Ipid, serviceId: Sid}).then(() => {res.end() ;})})
            }
          }else{
            res.end()
          }

        })
        })





      )

      }
      else {
        IP_Machine.update(


               {IPmachine: req.body.IPmachine,
               nom_machine: req.body.nom_machine,
               email_warning: req.body.email_warning,
               userId: idemail},
               {where: {
                IPmachine: req.body.IPmachine
              }}
        ).then(() =>

        IP_Machine.findAll({
          attributes: ['id'],
          where: {
          IPmachine: req.body.IPmachine
        }
        }).then((result) => {
          let IPmachineId = result[0].dataValues.id;
        IP_Machine_Service.destroy({
          attributes: ['serviceId'],

          where: {

          IPMachineId: result[0].dataValues.id
        }
        }).then(() => {
          if(!(req.body.service=== null )){
            for(i=0; i < req.body.service.length; i++) {
              if(req.body.service[i] === 'docker') {
                IP_Machine_Docker_Container.create({
                  IPMachineId: IPmachineId
                });
                //console.log("if")
              }
              Promise.all([IP_Machine.findAll({
                where: {
                IPmachine: req.body.IPmachine
              }
            }), Service.findAll({
              where: {
              service: req.body.service[i]
            }
            })])
                  .then(([IPmachine, service]) => {
                  let Ipid=IPmachine[0].dataValues.id; let  Sid=service[0].dataValues.id;
                  IP_Machine_Service.create({IPMachineId: Ipid, serviceId: Sid}).then(() => {res.end() ;})})
            }
          }else{
            res.end()
          }

        })
        })





      )

      }



    })
});
}
});
});


router.post('/insertContainer',ajoutIPChecker, function(req, res, next){
  User.findOne({
    attributes: ['email'],
    where: {
      token: req.body.token
    }
  }).then((result) => {
    if(result.email) {
  IP_Machine.findOne({
    attributes: ['id'],
    where: {
      IPmachine: req.body.IPmachine
    }
  }).then((result) => {
    var IDmachine = result.id
    IP_Machine_Docker_Container.findOne({
      where:{
      IPMachineId: IDmachine
    }
  }).then((ipmachdoc) => {

    if (ipmachdoc === null) {

    IP_Machine_Docker_Container.create({IPMachineId: IDmachine}).then((result) => {

        Docker_Container.destroy({
          where: {
            IPMachineDockerContainerId: IDmachine
          }
        }).then((result) => {
          for(i=0;i<req.body.list_service.length;i++){
        Docker_Container.create({container_id: req.body.list_service[i].container_id,
          container_name: req.body.list_service[i].container_name,
        IPMachineDockerContainerId: IDmachine}).then(() => {
          if(i == req.body.list_service.length){
            res.json();
          }
        });

    }
      });
    });
} else {
  Docker_Container.destroy({
    where: {
      IPMachineDockerContainerId: IDmachine
    }
  }).then((result) => {
    for(i=0;i<req.body.list_service.length;i++){
  Docker_Container.create({container_id: req.body.list_service[i].container_id,
    container_name: req.body.list_service[i].container_name,
  IPMachineDockerContainerId: IDmachine}).then(() => {
    if(i == req.body.list_service.length){
      res.json();
    }
  });;

}
});
}
    });
    });
  }
});
});


router.post('/insertMetrique',ajoutIPChecker,function(req, res, next) {

  User.findOne({
    attributes: ['email'],
    where: {
      token: req.body.token
    }
  }).then((result) => {
    if(result.email) {
  Promise.all([Metrique.create({
       date: req.body.date,
       heure: req.body.heure,
       IPmachine: req.body.IPmachine,
       metrique: req.body.metrique
}), Service.findAll({
  where: {
  service: req.body.service
}
})])
      .then(([metrique, service]) => {

         Metrique_Service.create({metriqueId: metrique.id, serviceId: service[0].dataValues.id}).then(() => {res.json();})
    }



      )
    }
    });
});








router.put('/updateNom', function(req, res, next) {
  IP_Machine.update(
    {nom_machine: [req.body.nom]},
    {where: {
      IPmachine: req.body.IPmachine
      }}
    );
});

//A partir de l'email de l'user, retourne la liste des ips de ses machines
router.post('/IPbyEmail', function(req, res, next) {
  User.findOne({
    attributes: ['id'],
    where: {
      email: req.body.email
    }
}).then(result => {
  if(result== null){
    result={}
    result.dataValues = []

  }
  IP_Machine.findAll({

    attributes: ['IPmachine','nom_machine'],
    where: {
      userId: result.dataValues.id
      }
    }).then(result => {
      //console.log({result})
      liste_ip = [];
      for(i = 0; i < result.length; i++) {
        liste_ip.push({'ip':result[i].dataValues.IPmachine,'nom':result[i].dataValues.nom_machine});
    };
    //console.log(liste_ip);
    res.json(liste_ip);
    })

  })
});

router.post('/ServiceByIP', authController.IsAuthenticatedByIP,function(req, res, next) {
  IP_Machine.findAll({
    attributes: ['id'],
    where: {
    IPmachine: req.body.IPmachine
  }
}).then(result => {
  IP_Machine_Service.findAll({
  attributes: ['serviceId'],
  where: {
  IPMachineId: result[0].dataValues.id
  }
}).then(result => {
  list_id_service = [];
  for(i = 0; i < result.length; i++) {
    list_id_service.push(result[i].dataValues.serviceId);
  };
  Service.findAll({
  attributes: ['service'],
  where: {
  id: list_id_service
      }
    }).then(result => {
      list_service = [];
    for(i = 0; i < result.length; i++) {
      list_service.push(result[i].dataValues.service);
    };
    res.json({'services': list_service});
  })
        })
    });
});

router.post('/containerByIP', authController.IsAuthenticatedByIP,function(req, res, next) {
  IP_Machine.findOne({
    attributes: ['id'],
    where: {
    IPmachine: req.body.IPmachine
  }
}).then(result => {
  Docker_Container.findAll({
  attributes: ['container_id','container_name'],
  where: {
  IPMachineDockerContainerId: result.id
  }
}).then(result => {
    data = [];
    for(i=0; i<result.length; i++) {
      data.push({"container_id":result[i].dataValues.container_id,"container_name":result[i].dataValues.container_name})
    }
    res.json({"service":"docker","container":data});
        })
    });
});


module.exports = router;
