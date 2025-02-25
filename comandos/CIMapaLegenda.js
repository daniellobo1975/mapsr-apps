// code
const R = require('r-integration');
let result = R.callMethod("/mnt/volume_mapsr_11may22/R/CIMapaLegenda.R","x", {NomeConsulta: "Socicana", NomeLegenda: "Silvicultura", Ano: "2020"})
console.log(result);

