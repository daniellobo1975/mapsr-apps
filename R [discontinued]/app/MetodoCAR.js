// code

// ConsultaCAR
// Input do usuário 01: numero do CAR somento números e letras (sem pontos, traços etc)
// Input do usuário 02: ano da consulta
// Output: arquivo .csv  (salvo na pasta "/mnt/volume_mapsr_11may22/fazendas" com versao e ano correspondentes)
// Input do sistema ("nosso"): geoJson== FALSE (não salva aquivo .geoJson) e versão_biomas=="v06".

// Código
const R = require('r-integration');
let result = R.callMethod("/mnt/volume_mapsr_11may22/R/app/mapsR.R","ConsultaCAR", {fcar: "SP354890613CBFC3115AD49A9B51FC014A701B019", ano_referencia: "2020", versao_biomas: "v06", geoJson: "TRUE"});
console.log(result);
// end
