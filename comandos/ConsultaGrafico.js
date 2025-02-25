// code
const R = require('r-integration');
let result = R.callMethod("/mnt/volume_mapsr_11may22/R/ConsultaGraficoV1.R","x", {NomeConsulta: "Sogro", Ano: "2020"})
console.log(result);

