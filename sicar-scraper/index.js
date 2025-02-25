'use strict';

const express = require('express');
const cors = require('cors');

const PORT = 8080;

const app = express();
const api = require('./api');

app.use(express.static('public'));
app.use('/app', express.static('app'));
app.use(cors());

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.use('/api', api);

const server = app.listen(PORT, () => console.log(`Listening at port: ${PORT}`));

function gracefulShutdown(event) {
    return async code => {
        console.info(`${event} signal received with code ${code}`);
        console.log('Encerrando Server Express');
        server.close(() => {
            console.log('Server Express encerrado');
            process.exit(code || 0)
        });
    }
}

process.on('SIGINT', gracefulShutdown('SIGINT'));
process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('exit', code => {
    console.log('exit signal received', code);
});
process.on('uncaughtException', (error, origin) => {
    console.log(`${origin} signal received. \n ${error}`);
});
process.on('unhandledRejection', error => {
    console.log(`unhandledRejection signal received. \n ${error}`);
});