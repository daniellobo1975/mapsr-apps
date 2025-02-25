


// code

// ConsultaCAR
// Input do usuário 01: numero do CAR somento números e letras (sem pontos, traços etc)
// Input do usuário 02: ano da consulta
// Output: arquivo .csv  (salvo na pasta "/mnt/volume_mapsr_11may22/fazendas" com versao e ano correspondentes)
// Input do sistema ("nosso"): geoJson== FALSE (não salva aquivo .geoJson) e versão_biomas=="v07"

// Código
const R = require('r-integration');
// let result =   R.callMethod("/mnt/volume_mapsr_11may22/mapsr/mapsr_api/src/script_R/mapsR.R","ConsultaCAR", {fcar: "SP-3524303-1739C594B4F540C59AF7B47ADBB2D62D", ano_referencia: "2023", versao_biomas: "v09", geoJson: "TRUE"});
let result =   R.callMethod("/mnt/volume_mapsr_11may22/mapsr/mapsr_api/src/script_R/mapsR-2.R","busCAR", {latitude: "-22.050656824840956", longitude: "-47.96190036699626", ano_referencia: "2019", versao_biomas: "v09"});
// let dinamizado = R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR-Dinamizada.R","dinamizar", {fcar: "SP-3524303-1739C594B4F540C59AF7B47ADBB2D62D", ano_referencia: "2022", versao_biomas: "v09"});
// let result =   R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R","busCAR", {latitude: "-22.050656824840956", longitude: "-47.96190036699626", ano_referencia: "2020", versao_biomas: "v08"});
// let result =   R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R","busCAR", {latitude: "-11.478700", longitude: "-66.381600", ano_referencia: "2020", versao_biomas: "v08"});
// let result =   R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R","busCAR", {latitude: "-14.234600", longitude: "-58.649900", ano_referencia: "2020", versao_biomas: "v08"});
// let result =   R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R","busCAR", {latitude: "-22.784890", longitude: "-45.136820", ano_referencia: "2020", versao_biomas: "v08"});

// let result =   R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R","busCAR", {latitude: "-15.467560", longitude: "-41.359470", ano_referencia: "2020", versao_biomas: "v08"});

console.log(result);
// console.log(dinamizado);

// anos: [2021, 2022]
// fcars: ["CAR01", "CAR0"2, ...]


// end
// exemplo: SP354890613CBFC3115AD49A9B51FC014A701B019
// exemplo2: SP-3548906-13CBFC3115AD49A9B51FC014A701B019
// exemplo3: SP-3518602-94720878D5644304A5B85DC41F2E30CD
// Santa Isabel: SP-3524303-1739C594B4F540C59AF7B47ADBB2D62D
