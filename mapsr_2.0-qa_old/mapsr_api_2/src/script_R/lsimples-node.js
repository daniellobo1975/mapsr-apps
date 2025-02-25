

// CÃ³digo
const { spawn } = require('child_process');

const R = require('r-integration');

const jsonString = JSON.stringify([2021, 2022]);
const jsonStringCars = JSON.stringify(["SP-3544806-6CF772E4D65D4BCBA760467FBB336F6E"]);
console.log(`Entrada: ${jsonString }`);
const lsimplesProcess = spawn('Rscript', [
  '/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/lsimples.R',
  'loopJson',
  jsonString,
  jsonStringCars
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
  } else {
    console.error(`Processo R encerrou com código de erro ${code}`);
  }
});
