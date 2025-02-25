'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const ufs = JSON.parse(fs.readFileSync('ufs.json'));
const { createAnticaptcha } = require('./anticaptcha');
const { sleep } = require('./utils');

moment.locale('pt-BR');

const navOptions = {
    timeout: 0,
    waitUntil: [
        'load',
        'domcontentloaded',
        'networkidle0',
        'networkidle2'
    ]
};

let browser;
let estadosBaixadas = 0;
let totalPoligonos = 0;

async function start({ uf, captcha_api_key, nome_pasta, polignos }) {
    console.log('Iniciando o teste');
    console.log("poligono correto: ", polignos);

    try {
        uf = uf == 'Todos' ? '' : uf;

        global.STARTTIME = moment();
        global.STATUS = 'Abrindo Navegador';
        global.TEMPORESTANTE = 'Calculando...';
        console.log(global.STATUS);

        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--ignore-certificate-errors'
            ]
        });

        const page = await browser.newPage();
        // console.log('Dados da page: ', page);
        const ufsToScrap = uf ? [uf] : Object.keys(ufs);
        // console.log('Dados do ufsToScrap: ', ufsToScrap);

        totalPoligonos = ufsToScrap.reduce((total, uf) => {
            total += ufs[uf].length;
            return total;
        }, 0)

        console.log('Poligonos: ', totalPoligonos);

        console.log('foi para página inicial');
        await page.goto(`https://consultapublica.car.gov.br/publico/imoveis/index`, {
            timeout: 0,
            waitUntil: [
                'domcontentloaded'
            ]
        });

        estadosBaixadas = 0;

        console.log("poligono correto: ", polignos);
        // for (let uf of ufsToScrap) {
        //     await scrapUf(uf, page, captcha_api_key, nome_pasta, polignos);
        // }
        await scrapUf(uf, page, captcha_api_key, nome_pasta, polignos);

    } catch (error) {
        console.log(error);
    }

    await stop();
}

let posicaoPoligno = 2;

async function scrapUf(uf, page, captcha_api_key, nome_pasta, polignos) {
    await page.goto(`https://consultapublica.car.gov.br/publico/estados/downloads`, navOptions);

    let normalizedUf = String(uf).trim();
    normalizedUf = normalizedUf.replace(/^"|"$/g, '');

    console.log("Estado loops: ", uf);
    await page.waitForTimeout(200);
    // await scrapPoligono(page, captcha_api_key, nome_pasta, btnsEstados, estados, estado, uf, polignos);

    console.log('Nomalize UF: ', normalizedUf);
    if (normalizedUf && normalizedUf.trim() !== "") {
        posicaoPoligno = 2;
        console.log('CAIU EM unico');
        console.log('O ESTADO É: ', uf);
        console.log('O valor de UF É: ', uf);
        let btnsEstados = await page.$(`button[data-nome-estado="${uf}"]`);
        await scrapPoligono(page, captcha_api_key, nome_pasta, btnsEstados, estados, polignos, normalizedUf);
    }
    else {
        var estados = [
            "Acre",
            "Alagoas",
            "Amapá",
            "Amazonas",
            "Bahia",
            "Ceará",
            "Distrito Federal",
            "Espirito Santo",
            "Goiás",
            "Maranhão",
            "Mato Grosso",
            "Mato Grosso do Sul",
            "Minas Gerais",
            "Pará",
            "Paraíba",
            "Paraná",
            "Pernambuco",
            "Piauí",
            "Rio de Janeiro",
            "Rio Grande do Norte",
            "Rio Grande do Sul",
            "Rondônia",
            "Roraima",
            "Santa Catarina",
            "São Paulo",
            "Sergipe",
            "Tocantins"
        ];

        for (const estado of estados) {
            posicaoPoligno = 2;
            // console.log('CAIU EM TODOS');

            await page.waitForTimeout(1000);
            let btnsEstados = await page.$(`button[data-nome-estado="${estado}"]`);

            // await scrapPoligono(page, captcha_api_key, nome_pasta, btnsEstados, estados, polignos);
            // global.PERCENTUAL = parseInt((++estadosBaixadas) / totalPoligonos * 100000) / 1000;
            // console.log(global.PERCENTUAL);

            await scrapPoligono(page, captcha_api_key, nome_pasta, btnsEstados, estado, polignos, estado);
        }
    }
}

//Valida a posição atual para evitar problemas tentativas
let posicao = 0;
//Valida as tentativas por cada estado sendo 3 no total
let tentativas = 0

async function scrapPoligono(page, captcha_api_key, nome_pasta, btnsEstados, estados, polignos, estado) {
    try {
        let normalizedPolignos = String(polignos).trim();
        normalizedPolignos = normalizedPolignos.replace(/^"|"$/g, '');

        // console.log('O polignos é: ', polignos);
        // console.log('A posição é: ', posicaoPoligno);

        await page.waitForTimeout(1000);
        // console.log('Polignos normalizado após remover aspas extras:', JSON.stringify(normalizedPolignos));

        //para todos
        let anticaptcha = createAnticaptcha(captcha_api_key);

        // Verifica se é exatamente "Todos"
        if (normalizedPolignos === "Todos") {
            console.log("Caiu em Todos");
            for (; posicaoPoligno <= 10; posicaoPoligno++) {
                // console.log("O total de polignos é: ", totalPoligonos);

                const duration = moment.duration(moment().diff(global.STARTTIME));
                // console.log('Posicao do poligno: ', posicaoPoligno);

                posicao = posicaoPoligno - 1;

                await page.keyboard.press('Escape');

                // global.STATUS = `Baixando | Poligono ${parseInt(poligonos) + 1} de ${poligonos.length}`;
                // global.CIDADE = poligonos[estado];
                // console.log('Poligno selecionado:', estado);

                console.log();

                await page.bringToFront();
                await btnsEstados.click();
                await page.bringToFront();
                await page.waitForTimeout(600);

                // console.log('Clicou no poligno número: ', posicaoPoligno);
                let xpath = `//div[@id='modal-download-base-poligono']/div/div/div[2]/div/div[${posicaoPoligno}]/button/span`;
                let btnsDownloadPolignos = await page.$x(xpath);
                await btnsDownloadPolignos[0].click();
                await page.waitForTimeout(600);

                // console.log('cliclou em baixar');

                await page.waitForTimeout(600);
                await page.waitForSelector('#img-ReCaptcha-base-downloads', { visible: true });
                await page.waitForTimeout(600);
                let imageSrc = await page.$eval('#img-ReCaptcha-base-downloads', img => img.src);

                let base64img = await page.evaluate(() => {
                    let img = document.querySelector('#img-ReCaptcha-base-downloads');
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                    return canvas.toDataURL().split('base64,')[1];
                });

                // console.log('Imagem capturada em base64');
                const captchaText = await anticaptcha.solve(base64img);
                await page.waitForTimeout(600);
                const captchaTextString = String(captchaText);
                // let captchaTextString = "Teste123";
                // console.log('Texto do captcha', captchaTextString);
                // console.log('Aguarda o .form-ReCaptcha-download');
                await page.waitForSelector('#form-ReCaptcha-download', { visible: true });

                for (let i = 0; i < captchaTextString.length; i++) {
                    await page.focus('#form-ReCaptcha-download');
                    let randomDelay = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
                    await page.keyboard.type(captchaTextString[i], { delay: randomDelay });
                }

                // console.log('Dígistou: ', captchaTextString);
                await page.waitForTimeout(200);

                let errorMessage = await page.$eval('body', (body) => {
                    return body.innerText.includes("Os caracteres da imagem não foram digitados corretamente.");
                });

                if (errorMessage) {
                    console.log('Erro: Os caracteres não foram digitados corretamente.');
                    await scrapPoligono(page, captcha_api_key, nome_pasta, btnsEstados, estados, polignos, estado); //aqui
                } else {
                    console.log('Texto digitado corretamente!');
                    tentativas = 0;
                }

                // console.log('Pasta para salvar');
                await page._client.send('Page.setDownloadBehavior', {
                    behavior: 'allow',
                    downloadPath: path.resolve(`/mnt/volume_sfo3_01/downloads/sicar-scrapper/${nome_pasta}/${estado}`)
                    // downloadPath: path.resolve(`\\mnt\\volume_sfo3_01\\downloads\\sicar-scrapper\\${nome_pasta}`)
                });


                await page.waitForTimeout(600);
                // console.log('Botão baixar dados');
                let btnBaixar = await page.$('#btn-confirmar-download-base-poligono');
                await btnBaixar.click();

                // console.log('Dados já baixados');
                global.PERCENTUAL = parseInt((++estadosBaixadas) / totalPoligonos * 100000) / 1000;
                // console.log(global.PERCENTUAL);

                await updateProgress();
                await page.waitForTimeout(3000);

                // Use um loop para verificar mudanças no estilo do elemento
                let elementoEscondido = false;
                while (!elementoEscondido) {
                    // Pegue o estilo do elemento, garantindo que o elemento existe
                    const displayStyle = await page.evaluate(() => {
                        const elemento = document.querySelector('#loading');
                        // Verifique se o elemento existe antes de acessar o estilo
                        return elemento ? elemento.style.display : null;
                    });

                    if (displayStyle === 'none') {
                        // console.log('Saiu');
                        elementoEscondido = true;
                    } else if (displayStyle === null) {
                        // console.log('#loading não encontrado no DOM');
                        break;
                    } else {
                        await page.waitForTimeout(1000);
                    }
                }
            }
        }
        else {
            console.log("Caiu em Unico");
            console.log("normalizedPolignos é: ", normalizedPolignos);

            if (normalizedPolignos == "Perímetros dos imóveis") posicaoPoligno = 2;
            if (normalizedPolignos == "Área de Preservação Permanente") posicaoPoligno = 3;
            if (normalizedPolignos == "Remanescente de Vegetação Nativa") posicaoPoligno = 4;
            if (normalizedPolignos == "Área Consolidada") posicaoPoligno = 5;
            if (normalizedPolignos == "Área de Pousio") posicaoPoligno = 6;
            if (normalizedPolignos == "Hidrografia") posicaoPoligno = 7;
            if (normalizedPolignos == "Uso Restrito") posicaoPoligno = 8;
            if (normalizedPolignos == "Servidão Administrativa") posicaoPoligno = 9;
            if (normalizedPolignos == "Reserva Legal") posicaoPoligno = 10;

            // console.log('Sem ser o todos: ', normalizedPolignos);
            await page.keyboard.press('Escape');

            // global.STATUS = `Baixando | Poligono ${parseInt(poligonos) + 1} de ${poligonos.length}`;
            // global.CIDADE = poligonos[estado];
            // console.log('Poligno selecionado:', estado);

            console.log();

            await page.bringToFront();
            await btnsEstados.click();
            await page.bringToFront();
            await page.waitForTimeout(600);

            // console.log('Clicou no poligno número: ', posicaoPoligno);
            let xpath = `//div[@id='modal-download-base-poligono']/div/div/div[2]/div/div[${posicaoPoligno}]/button/span`;
            let btnsDownloadPolignos = await page.$x(xpath);
            await btnsDownloadPolignos[0].click();
            await page.waitForTimeout(600);

            // console.log('cliclou em baixar');

            await page.waitForTimeout(600);
            await page.waitForSelector('#img-ReCaptcha-base-downloads', { visible: true });
            await page.waitForTimeout(600);
            let imageSrc = await page.$eval('#img-ReCaptcha-base-downloads', img => img.src);

            let base64img = await page.evaluate(() => {
                let img = document.querySelector('#img-ReCaptcha-base-downloads');
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                return canvas.toDataURL().split('base64,')[1];
            });

            // console.log('Imagem capturada em base64');
            const captchaText = await anticaptcha.solve(base64img);
            await page.waitForTimeout(600);
            const captchaTextString = String(captchaText);
            // let captchaTextString = "Teste123";
            // console.log('Texto do captcha', captchaTextString);
            // console.log('Aguarda o .form-ReCaptcha-download');
            await page.waitForSelector('#form-ReCaptcha-download', { visible: true });

            for (let i = 0; i < captchaTextString.length; i++) {
                await page.focus('#form-ReCaptcha-download');
                let randomDelay = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
                await page.keyboard.type(captchaTextString[i], { delay: randomDelay });
            }

            // console.log('Dígistou: ', captchaTextString);
            await page.waitForTimeout(200);

            let errorMessage = await page.$eval('body', (body) => {
                return body.innerText.includes("Os caracteres da imagem não foram digitados corretamente.");
            });

            if (errorMessage) {
                console.log('Erro: Os caracteres não foram digitados corretamente.');
                await scrapPoligono(page, captcha_api_key, nome_pasta, btnsEstados, estados, polignos, estado); //aqui
            } else {
                console.log('Texto digitado corretamente!');
                tentativas = 0;
            }

            // console.log('Pasta para salvar');
            await page._client.send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: path.resolve(`/mnt/volume_sfo3_01/downloads/sicar-scrapper/${nome_pasta}/${estado}`)
                // downloadPath: path.resolve(`\\mnt\\volume_sfo3_01\\downloads\\sicar-scrapper\\${nome_pasta}`)
            });


            await page.waitForTimeout(600);
            // console.log('Botão baixar dados');
            let btnBaixar = await page.$('#btn-confirmar-download-base-poligono');
            await btnBaixar.click();

            // console.log('Dados já baixados');
            global.PERCENTUAL = parseInt((++estadosBaixadas) / totalPoligonos * 100000) / 1000;
            // console.log(global.PERCENTUAL);

            await updateProgress();
            await page.waitForTimeout(3000);

            // Use um loop para verificar mudanças no estilo do elemento
            let elementoEscondido = false;
            while (!elementoEscondido) {
                // Pegue o estilo do elemento, garantindo que o elemento existe
                const displayStyle = await page.evaluate(() => {
                    const elemento = document.querySelector('#loading');
                    // Verifique se o elemento existe antes de acessar o estilo
                    return elemento ? elemento.style.display : null;
                });

                if (displayStyle === 'none') {
                    // console.log('Saiu');
                    elementoEscondido = true;
                } else if (displayStyle === null) {
                    // console.log('#loading não encontrado no DOM');
                    break;
                } else {
                    await page.waitForTimeout(1000);
                }
            }
        }

        await page.waitForTimeout(5000);
        if (posicaoPoligno == 11) return;

    } catch (error) {
        if (tentativas < 12) {
            tentativas++;
            // console.log('Tentativa: ', tentativas);
            // posicaoPoligno--;
            if (error == 'Erro de captcha') {
                console.log(`Erro de captcha, tentando novamente... ${tentativas}`);
            }
            // console.log('Erro no captcha?'); //aqui
            posicao = - 1;
            return await scrapPoligono(page, captcha_api_key, nome_pasta, btnsEstados, estados, polignos, estado);
        } else {
            // console.log('Máximo de tentativas atingido');
            return;
        }
    }
}

async function updateProgress() {
    //calcula o tempo restante estimado
    const duration = moment.duration(moment().diff(global.STARTTIME));
    const perItem = duration / estadosBaixadas;
    const remaining = totalPoligonos - estadosBaixadas;
    const estimated = remaining * perItem;

    global.TEMPORESTANTE = `${moment.duration(estimated).humanize()} restante(s)`;
    global.TEMPORESTANTE = global.TEMPORESTANTE[0].toUpperCase() + global.TEMPORESTANTE.slice(1);
    console.log(global.TEMPORESTANTE);
}

async function stop() {
    global.STATUS = 'Pronto';
    global.CIDADE = '';
    global.UF = '';
    global.PERCENTUAL = -1;
    global.TEMPORESTANTE = '';

    try {
        await browser.close();
    } catch (error) { }
}


module.exports = {
    start,
    stop
};

//PARA TESTES COM AntiCaptcha
// async function scrapCidade(page, captcha_api_key, nome_pasta, btnsEstados, cidades, i, uf, tentativas = 0) {
//     try {
//         const anticaptcha = createAnticaptcha(captcha_api_key);

//         // Caminhos fixos para as 3 imagens
//         const caminhosImagens = [
//             path.resolve(__dirname, 'ReCaptcha1.png'),
//             path.resolve(__dirname, 'ReCaptcha2.png'),
//             path.resolve(__dirname, 'ReCaptcha3.png'),
//         ];

//         for (const caminho of caminhosImagens) {
//             if (!fs.existsSync(caminho)) {
//                 throw new Error(`A imagem não foi encontrada: ${caminho}`);
//             }

//             // Lê o arquivo e converte para Base64
//             const base64img = fs.readFileSync(caminho, { encoding: 'base64' });

//             console.log(`Enviando imagem ${path.basename(caminho)} para o AntiCaptcha...`);
//             const captchaText = await anticaptcha.solve(base64img);
//             console.log(`Texto do captcha resolvido: ${captchaText}`);
//         }

//         console.log('Todas as imagens fixas foram processadas com sucesso!');
//     } catch (error) {
//         console.error('Erro ao processar as imagens:', error.message);
//     }
// }