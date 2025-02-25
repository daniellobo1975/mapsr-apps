// code
const R = require('r-integration');
let result = R.callMethod("/mnt/volume_mapsr_11may22/R/busCAR.R","busCAR", {longitude: "-22.05065185281782", latitude: "-47.961964739909824"})
console.log(result);
