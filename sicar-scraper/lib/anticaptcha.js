const axios = require('axios');
const { sleep } = require('./utils');

function createAnticaptcha(captchaApiKey) {
    async function solve(base64Img) {
        try {
            const taskId = await createTask({
                "type": "ImageToTextTask",
                "body": base64Img,
                "phrase": false,
                "case": false,
                "numeric": 0,
                "math": false,
                "minLength": 0,
                "maxLength": 0
            });

            const result = await getTaskResult(taskId);

            return result;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async function createTask(task) {
        const response = await axios({
            method: 'post',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            url: 'https://api.anti-captcha.com/createTask',
            data: {
                clientKey: captchaApiKey,
                task
            }
        });

        return response.data.taskId;
    }

    async function getTaskResult(taskId, tentativas = 0) {
        const response = await axios({
            method: 'post',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            url: 'https://api.anti-captcha.com/getTaskResult',
            data: {
                clientKey: captchaApiKey,
                taskId
            }
        });

        if (response.data.status == 'ready') {
            return response.data.solution.text;
        } else {
            await sleep(1000);
            ++tentativas;
            if (tentativas < 60) {
                return await getTaskResult(taskId, tentativas);
            } else {
                throw 'Erro de captcha'
            }
        }
    }

    return {
        solve
    }
}

module.exports = {
    createAnticaptcha
}