// code

// busCAR
// Input do usuário 01: longitude e latitude (com decimal usando ". " -- mesma ordem que aparece no google Maps ao alfinetar um área)
// Input do usuário 02: ano da consulta
// Output: arquivo .csv  (salvo na pasta "/mnt/volume_mapsr_11may22/fazendas" com versao e ano correspondentes)
// Input do sistema ("nosso"): versão_biomas=="v06".

// Código
const R = require('r-integration');
let result = R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R","busCAR", {latitude: "-21.309", longitude: "-48.155", ano_referencia: "2021", versao_biomas: "v07"});
// ambiente teste: let result = R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR_vtemp.R","busCAR", {latitude: "-21.3093", longitude: "-48.1555", ano_referencia: "2021", versao_biomas: "v07"});
console.log(result);
// end
// centro Ribeirao Preto: -21.134041941410022, -47.81769422059219
// fazenda Mario: "-22.050", "-47.961"
// Fazenda Santa Isabel: -21.30930260750733, -48.15555177395011
