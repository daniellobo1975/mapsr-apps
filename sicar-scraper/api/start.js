'use strict';

const puppeteerScraper = require('../lib/puppeteer');

function createStartRoute() {
    async function start(req, res) {
        try {
            const { captcha_api_key, nome_pasta, polignos } = req.query;

            console.log('Chegou na API');
            console.log('Dentro da função start é o valor do polignos: ', polignos);
            if (req.get('x-access-token') != 'process.env.SICAR_TOKEN') {
                throw 'Envie um token válido no cabecalho x-access-token';
            }

            if (!captcha_api_key) {
                throw 'Informe o parametro "captcha_api_key"';
            }

            if (!nome_pasta) {
                throw 'Informe o parametro "nome_pasta"';
            }

            if (!polignos) {
                console.log('Polignos start: ', polignos);
                throw 'Informe o parametro "polignos"';
            }

            if (global.PERCENTUAL == -1) {
                global.PERCENTUAL = 0;
                puppeteerScraper.start(req.query);

                res.json({
                    status: global.STATUS,
                    cidade: global.CIDADE,
                    uf: global.UF,
                    percentual: global.PERCENTUAL == -1 ? 0 : global.PERCENTUAL,
                    tempoRestante: global.TEMPORESTANTE
                });

            } else {
                res.json({
                    status: 'Já iniciado: ' + global.STATUS,
                    cidade: global.CIDADE,
                    uf: global.UF,
                    percentual: global.PERCENTUAL == -1 ? 0 : global.PERCENTUAL,
                    tempoRestante: global.TEMPORESTANTE
                });
            }

        } catch (error) {
            res.status(400).json({
                msg: 'Erro ao iniciar extração',
                error: (error || '').toString()
            });

            global.STATUS = 'Pronto';
            global.CIDADE = '';
            global.UF = '';
            global.PERCENTUAL = -1;
            global.TEMPORESTANTE = '';

            puppeteerScraper.stop();
        }
    }

    return {
        start
    };
}

module.exports = createStartRoute;