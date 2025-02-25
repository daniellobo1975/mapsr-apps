'use strict';

const fs = require('fs');
const path = require('path');

function createStatusRoute() {
    async function get(req, res) {
        try {
            const year = req.year || new Date().getFullYear().toString();
            const files = fs.readdirSync(path.join('public', year.toString()));
        
            res.send(`<html>
                <h1>${year}</h1>
                ${files.map(name => {
                    return `<li><a target="_blank" href="/${year}/${name}">${name}</a></li>`
                })}
            </html>`)
    
        } catch(error) {
            res.status(400).json({ 
                msg: 'Erro ao obter arquivos',
                error: (error || '').toString()
            });
        }
    }
    
    return {
        get
    };
}

module.exports = createStatusRoute;