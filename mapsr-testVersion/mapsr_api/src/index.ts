import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";  // Importação padrão
import bodyParser from "body-parser";  // Importação padrão
import { Request, Response } from "express";
import { Routes } from "./routes";
import cors from 'cors';  // Importação padrão

import config from "./configuration/config";
import auth from "./middlaware/auth";

// create express app
const app = express();

app.use(cors());  // Agora, `cors()` é chamado corretamente
app.use(bodyParser.json({ limit: '6000mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(auth);  // Passa pelo middleware antes das rotas

// Registrar as rotas definidas na aplicação
Routes.forEach(route => {
    (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
        const result = (new (route.controller as any))[route.action](req, res, next);
        if (result instanceof Promise) {
            result.then(d => { // Retorna erro ou resposta adequada
                if (d && d.status)
                    res.status(d.status).send(d.message || d.errors);
                else if (d && d.file)
                    res.sendFile(d.file);
                else
                    res.json(d);
            });
        } else if (result !== null && result !== undefined) {
            res.json(result);
        }
    });
});

app.listen(Number(config.port), '0.0.0.0', async () => {
    console.log(`API initialized on port ${config.port}`);
    try {
        await createConnection();
        console.log('Database connected');
        console.log(`Express server has started on port ${config.port}. Open http://localhost:${config.port} to see results`);
    } catch (error) {

       console.error('Error details:', JSON.stringify(error));

        
    }
});
