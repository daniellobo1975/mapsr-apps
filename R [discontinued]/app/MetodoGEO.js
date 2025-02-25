// code

// ConsultaGEO
// Input do usuário 01: longitude e latitude (com decimal usando ". " -- mesma ordem que aparece no google Maps ao alfinetar um área)
// Input do usuário 02: ano da consulta
// Output: arquivo .csv  (salvo na pasta "/mnt/volume_mapsr_11may22/fazendas" com versao e ano correspondentes)
// Input do sistema ("nosso"): geoJson== FALSE (não salva aquivo .geoJson) e versão_biomas=="v06".

// Código
const R = require('r-integration');
let result = R.callMethod("/mnt/volume_mapsr_11may22/R/app/mapsR.R","ConsultaGEO", {longitude: "-21.310505605878213", latitude: "-48.154764491141345", ano_referencia: "2020", versao_biomas: "v06", geoJson: "TRUE"});
console.log(result);
// end




