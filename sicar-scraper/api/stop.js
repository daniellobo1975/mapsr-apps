'use strict';

const puppeteerScraper = require('../lib/puppeteer');

function createStopRoute() {
    async function stop(req, res) {
        try {
            if(req.get('x-access-token') != 'process.env.SICAR_TOKEN') {
                throw 'Envie um token válido no cabecalho x-access-token';
            }
            
            await puppeteerScraper.stop();

            res.json({ 
                status       : global.STATUS,
                cidade       : global.CIDADE,
                uf           : global.UF,
                percentual   : global.PERCENTUAL == -1 ? 0 : global.PERCENTUAL,
                tempoRestante: global.TEMPORESTANTE
            });
    
        } catch(error) {
            res.status(400).json({ 
                msg: 'Erro ao parar extração',
                error: (error || '').toString()
            });
        }
    }
    
    return {
        stop
    };
}

module.exports = createStopRoute;