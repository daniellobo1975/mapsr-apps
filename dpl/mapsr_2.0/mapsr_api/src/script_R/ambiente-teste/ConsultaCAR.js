

// code

// ConsultaCAR
// Input do usuário 01: numero do CAR somento números e letras (sem pontos, traços etc)
// Input do usuário 02: ano da consulta
// Output: arquivo .csv  (salvo na pasta "/mnt/volume_mapsr_11may22/fazendas" com versao e ano correspondentes)
// Input do sistema ("nosso"): geoJson== FALSE (não salva aquivo .geoJson) e versão_biomas=="v07".

// Código
const R = require('r-integration');
let result = R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/ambiente-teste/v-2023-05-15-mapsR.R","ConsultaCAR", {fcar: "SP-3524303-1739C594B4F540C59AF7B47ADBB2D62D", ano_referencia: "2017", versao_biomas: "v07", geoJson: "TRUE"});
console.log(result);
// end
// exemplo: SP354890613CBFC3115AD49A9B51FC014A701B019
// exemplo2: SP-3548906-13CBFC3115AD49A9B51FC014A701B019
// exemplo3: SP-3518602-94720878D5644304A5B85DC41F2E30CD
// Santa Isabel: SP-3524303-1739C594B4F540C59AF7B47ADBB2D62D
