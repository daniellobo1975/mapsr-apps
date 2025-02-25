
// code

// Código
const R = require('r-integration');
let result =   R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/loop_teste/input_json.R","roda_json", {x:'["a", "b", "c"]'});
console.log(result);

