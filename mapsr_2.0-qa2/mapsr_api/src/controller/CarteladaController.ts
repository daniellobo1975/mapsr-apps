import { spawn } from 'child_process';
import { Request } from 'express';
import * as path from 'path';
import variables from '../configuration/config';
const fsPromises = require("fs/promises");
const axios = require('axios');

export class CarteladaController {
    async cartelada(req: Request) {
        let { anos, cars } = req.body;

        console.log("anos", JSON.stringify(anos))
        console.log("cars", JSON.stringify(cars))

        const lsimplesProcess = spawn('Rscript', [
            '/mnt/volume_mapsr_11may22/mapsr_2.0-qa2/mapsr_api/src/script_R/lsimples.R',
            'loopJson',
            JSON.stringify(anos),
            JSON.stringify(cars)
        ]);

        let result = '';

        // Captura a saída padrão do processo R
        lsimplesProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        // Captura erros, se houverem
        lsimplesProcess.stderr.on('data', (data) => {
            console.error(`Erro no processo R: ${data}`);
        });

        // Manipula eventos de conclusão do processo
        lsimplesProcess.on('close', (code) => {
            if (code === 0) {
                console.log('Resultado em Node.js:', result.trim());
                console.log('Processo R concluido com sucesso.');
                this.webhook(anos, cars).then();
            } else {
                console.error(`Processo R encerrou com código de erro ${code}`);
            }
        });

        return { status: 200, message: "Geração em andamento!" }
    }

    async cartelada_v02(req: Request) {
        let { anos, cars } = req.body;

        var carsEntrada = JSON.stringify(cars);
        console.log("cars2", carsEntrada)
        console.log("anos2", JSON.stringify(anos))

        var carsJson = JSON.parse(carsEntrada);

        var errors = this.validateStringLength(carsJson);
        console.log("errors", JSON.stringify(errors));
        if (errors.length > 0) {
            return { status: 400, errors: errors }
        }
        else{
	 const lsimplesProcess = spawn('Rscript', [
            '/mnt/volume_mapsr_11may22/mapsr_2.0-qa2/mapsr_api/src/script_R/lsimples.R',
            'loopJson',
            JSON.stringify(anos),
            JSON.stringify(cars)
        ]);

        let result = '';

        // Captura a saída padrão do processo R
        lsimplesProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        // Captura erros, se houverem
        lsimplesProcess.stderr.on('data', (data) => {
            console.error(`Erro no processo R: ${data}`);
        });

        // Manipula eventos de conclusão do processo
        lsimplesProcess.on('close', (code) => {
            if (code === 0) {
                console.log('Resultado em Node.js:', result.trim());
                console.log('Processo R concluido com sucesso.');
                this.webhook(anos, cars).then();
            } else {
                console.error(`Processo R encerrou com código de erro ${code}`);
            }
        });

        return { status: 200, message: "Geração em andamento!" }
	}
    }

    validateStringLength(strings) {
        var errorList = [];
  console.log('iniciandovalidacao');

        for (var i = 0; i < strings.length; i++) {
            var str = strings[i];
            var hyphenCount = (str.match(/-/g) || []).length;
 		
	     console.log('hyphenCount ', hyphenCount);

            if (str.length === 43) {
                if (hyphenCount !== 2) {
                    errorList.push("Car tem 43 caracteres mas não tem 2 hífens: " + str);
                }
                if (str[2] !== '-' || str[10] !== '-') {
                    errorList.push("Car tem 43 caracteres mas não tem hífens nas posições 3 e 11: " + str);
                }
            }

            if (str.length !== 43) {
                errorList.push("Car não tem 43 caracteres: " + str);
            }

            if (str.length > 43) {
                errorList.push("Car tem mais de 43 caracteres: " + str);
            }
        }

        return errorList;
    }

    async webhook(anos, cars) {
        // Pasta onde os arquivos estão armazenados (ajuste conforme a estrutura do seu servidor)
        const baseFolderGeoJson = variables.folderStorageNovoGEOJSON;
        const baseFolderJson = variables.folderStorageNovoJSON;

        try {
            // Itera sobre os anos e nomes de cars
            for (const ano of anos) {
                for (const car of cars) {
                    // Constrói o caminho do arquivo
                    const filePath = path.join(baseFolderGeoJson, String(ano), `/geoJson/${car}.GeoJSON`);
                    console.log(`filePath`, filePath);
                    try {
                        // Lê o conteúdo do arquivo
                        const content = await fsPromises.readFile(filePath, 'utf8');

                        let objetoJson = JSON.parse(content);

                        objetoJson.features.forEach((e) => {
                            e.geometry = JSON.stringify(e.geometry);
                        });

                        // Constrói a requisição HTTP para o endpoint
                        const url = 'https://farmforest.com.br/api/1.1/wf/post_geojson';
                        const payload = {
                            body: objetoJson
                        };

                        // Envia a requisição HTTP usando axios
                        const response = await axios.post(url, payload, {
                            timeout: 180000, // 3 minutos em milissegundos
                        });
                        console.log(`Resposta do servidor: ${JSON.stringify(response.data)}`);
                    } catch (error) {
                        console.error(`Erro ao ler o arquivo ${car}.GeoJSON (${ano}):`, error.message);
                    }
                }
            }

            for (const ano of anos) {
                for (const car of cars) {
                    // Constrói o caminho do arquivo
                    const filePath = path.join(baseFolderJson, String(ano), `/json/${car}.json`);
                    console.log(`filePath json`, filePath);
                    try {
                        // Lê o conteúdo do arquivo
                        const content = await fsPromises.readFile(filePath, 'utf8');

                        let objetoJson = JSON.parse(content);

                        // Constrói a requisição HTTP para o endpoint
                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://farmforest.com.br/api/1.1/wf/getjson',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: objetoJson
                        };

                        const payload = {
                            body: objetoJson
                        };

                        // Envia a requisição HTTP usando axios
                        console.log(`json: ${JSON.stringify(payload)}`);


                        const response = await axios.post(config.url, payload, {
                            timeout: 180000, // 3 minutos em milissegundos
                        });
                        console.log(`Resposta do servidor json: ${JSON.stringify(response.data)}`);
                        
                        //console.log(`Resposta do servidor json: ${JSON.stringify(response.data)}`);
                    } catch (error) {
                        console.error(`Erro ao ler o arquivo ${car}.json (${ano}):`, error.message);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao processar os anos e cars:', error.message);
        }
    }
}