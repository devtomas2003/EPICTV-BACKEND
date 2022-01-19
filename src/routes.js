const express = require('express');
const routes = express.Router();

const Auth = require('./middlewares/Auth');

const OCA = require('./controllers/oca');
const Content = require('./controllers/Content');
const Streaming = require('./controllers/Streaming');
const Users = require('./controllers/Users');

routes.post('/updatebgp', OCA.updateOCABGP);
routes.post('/login', Users.sendLogin);
routes.use(Auth);
routes.get('/range/:contentid', Streaming.getRange);
routes.get('/getHomeData', Content.getPosterAndCategories);
routes.get('/cover/:coverid', Streaming.getCover);
routes.get('/getOCA', Content.selectStrSrv);

module.exports = routes;