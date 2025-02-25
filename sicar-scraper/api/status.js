'use strict';

function createStatusRoute() {
    async function get(req, res) {
        try {
            if(req.get('x-access-token') != 'process.env.SICAR_TOKEN') {
                throw 'Envie um token válido no cabecalho x-access-token';
            }

            res.json({ 
                status       : global.STATUS,
                cidade       : global.CIDADE,
                uf           : global.UF,
                percentual   : global.PERCENTUAL == -1 ? 0 : global.PERCENTUAL,
                tempoRestante: global.TEMPORESTANTE
            });
    
        } catch(error) {
            res.status(400).json({ 
                msg: 'Erro ao verificar status',
                error: (error || '').toString()
            });
        }
    }
    
    return {
        get
    };
}

module.exports = createStatusRoute;