'use strict';

const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config();

global.STATUS        = 'Pronto';
global.CIDADE        = '';
global.UF            = '';
global.PERCENTUAL    = -1;
global.TEMPORESTANTE = '';

//criando as rotas da aplicação

const createStartRoute = require('./start');
const createStatusRoute = require('./status');
const createStopRoute = require('./stop');
const createDownloadsRoute = require('./downloads');
const createLoginRoute = require('./login');

const startRoute = createStartRoute();
const statusRoute = createStatusRoute();
const stopRoute = createStopRoute();
const downloadsRoute = createDownloadsRoute();
const loginRoute = createLoginRoute();

router.get('/start',     startRoute.start);
router.post('/start',    startRoute.start);
router.get('/status',    statusRoute.get);
router.delete('/stop',   stopRoute.stop);
router.get('/downloads', downloadsRoute.get);
router.get('/login',     loginRoute.get);

module.exports = router;