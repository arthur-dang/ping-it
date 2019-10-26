const Sequelize = require('sequelize');

const sequelize = require('./sql_config');

const IP_Machine_ServiceModel = require('./models/IP_machine_service');
const Docker_ContainerModel = require('./models/docker_container');
const IP_machineModel = require('./models/IP_machine');
const IP_dashboardModel = require('./models/IP_dashboard');
const UserModel = require('./models/User');
const Apache_countModel = require('./models/apache_count');
const MetriqueModel = require('./models/metrique');
const IP_machine_docker_containerModel = require('./models/IP_machine_docker_container');
const TokenForgotPasswordModel = require('./models/TokenForgotPassword');
const ServiceModel = require('./models/service');
const Settings_warningModel = require('./models/settings_warning');

const Op = Sequelize.Op;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Service = ServiceModel(sequelize, Sequelize);
const IP_Machine = IP_machineModel(sequelize, Sequelize);
const IP_Dashboard = IP_dashboardModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Apache_count = Apache_countModel(sequelize, Sequelize);
const Settings_warning = Settings_warningModel(sequelize, Sequelize);
const TokenForgotPassword = TokenForgotPasswordModel(sequelize, Sequelize);
const Metrique = MetriqueModel(sequelize, Sequelize);
const IP_Machine_Service = IP_Machine_ServiceModel(sequelize, Sequelize);
Service.belongsToMany(IP_Machine, { through: IP_Machine_Service, unique: false });
IP_Machine.belongsToMany(Service, { through: IP_Machine_Service, unique: false });
const Metrique_Service = sequelize.define('metrique_service', {},{timestamps: false});
Metrique.belongsToMany(Service, { through: Metrique_Service, unique: false });
Service.belongsToMany(Metrique, { through: Metrique_Service, unique: false });
IP_Machine.belongsTo(User);
IP_Dashboard.belongsTo(IP_Machine, {foreignKey: 'IPmachineId', foreignKeyConstraint:true });
const Docker_Container = Docker_ContainerModel(sequelize, Sequelize);
const IP_Machine_Docker_Container = IP_machine_docker_containerModel(sequelize, Sequelize);
IP_Machine_Docker_Container.belongsTo(IP_Machine);
Settings_warning.belongsTo(IP_Machine);
IP_Machine_Docker_Container.hasMany(Docker_Container);
Apache_count.belongsTo(Settings_warning);
Service.create({service:'apache'});
Service.create({service:'docker'});
Service.create({service:'mongodb'});

sequelize.sync()
  .then(() => {
    console.log(`Database & tables created!`)
  })



exports.token_forgot_password = TokenForgotPassword;
exports.service = Service;
exports.apache_count = Apache_count;
exports.settings_warning = Settings_warning;
exports.ip_machine = IP_Machine;
exports.ip_dashboard = IP_Dashboard;
exports.user = User;
exports.metrique = Metrique;
exports.ip_machine_service = IP_Machine_Service;
exports.metrique_service = Metrique_Service;
exports.docker_container = Docker_Container;
exports.ip_machine_docker_container = IP_Machine_Docker_Container;
