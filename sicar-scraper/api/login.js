'use strict';

function createLoginRoute() {
    async function get(req, res) {
        try {
            const { usuario, senha } = req.query;

            if(!usuario) {
                throw 'Informe o parametro "usuario"';
            }

            if(!senha) {
                throw 'Informe o parametro "senha"';
            }

            if(usuario == 'v@d3r!' && senha == '#!Rub1!%)!!') {
                res.json({ 
                    token: 'process.env.SICAR_TOKEN'
                });
            } else {
                res.status(403).json({ 
                    msg: 'Usuário e/ou senha incorretos'
                });
            }
    
        } catch(error) {
            res.status(400).json({ 
                msg: 'Erro fazer login',
                error: (error || '').toString()
            });
        }
    }
    
    return {
        get
    };
}

module.exports = createLoginRoute;