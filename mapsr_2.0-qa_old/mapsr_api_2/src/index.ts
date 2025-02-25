import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import cors from 'cors'; // Correção aqui
import config from "./configuration/config";
import auth from "./middlaware/auth";

// Cria o aplicativo Express
const app = express();
app.use(cors()); // Configura o filtro de domínio

app.use(bodyParser.json({ limit: '6000mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth); // Middleware para ser usado antes das rotas

// Registra rotas Express definidas nas rotas da aplicação
Routes.forEach(route => {
    (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
        const result = (new (route.controller as any))[route.action](req, res, next);
        if (result instanceof Promise) {
            result.then(d => {
                if (d && d.status) {
                    res.status(d.status).send(d.message || d.errors);
                } else if (d && d.file) {
                    res.sendFile(d.file);
                } else {
                    res.json(d);
                }
            });
        } else if (result !== null && result !== undefined) {
            res.json(result);
        }
    });
});

// Inicia o servidor Express
app.listen(config.port, '0.0.0.0', async () => {
    console.log(`API inicializada na porta ${config.port}`);
    try {
        await createConnection();
        console.log('Banco de dados conectado');
        console.log(`Servidor Express iniciado na porta ${config.port}. Abra http://localhost:${config.port} para ver o resultado`);
    } catch (error) {
        if (error == 'ER_DUP_ENTRY') {
            console.error('Dado duplicado não aceito');
        } else {
            console.error('Banco de dados não conectado', error);
        }
    }
});
