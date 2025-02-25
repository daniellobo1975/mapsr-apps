// code
const R = require('r-integration');
let result = R.callMethod("/mnt/volume_mapsr_11may22/R/ConsultaCliente.R","x", {NomeConsulta: "COOPECREDI", AnoInicial: "2020", AnoFinal: "2020"});
console.log(result);
