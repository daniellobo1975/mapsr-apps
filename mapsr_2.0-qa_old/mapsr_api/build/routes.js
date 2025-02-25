"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
var CarteladaController_1 = require("./controller/CarteladaController");
var ClientController_1 = require("./controller/ClientController");
var FarmController_1 = require("./controller/FarmController");
var FarmRefController_1 = require("./controller/FarmRefController");
var queryReportController_1 = require("./controller/queryReportController");
var StorageController_1 = require("./controller/StorageController");
var UpdateController_1 = require("./controller/UpdateController");
var UserController_1 = require("./controller/UserController");
exports.Routes = [
    // Storage
    { method: "get", route: "/storage/:filename", controller: StorageController_1.StorageController, action: "getFile" },
    { method: "get", route: "/storageoutput/:filename", controller: StorageController_1.StorageController, action: "getOutputFile" },
    { method: "delete", route: "/storage/:filename", controller: StorageController_1.StorageController, action: "deleteFile" },
    // Storage 2.0
    { method: "get", route: "/storageoutputreport/:filename/:year", controller: StorageController_1.StorageController, action: "getOutputReportFile" },
    // Users 
    { method: "get", route: "/user", controller: UserController_1.UserController, action: "all" },
    { method: "get", route: "/user/:id", controller: UserController_1.UserController, action: "one" },
    { method: "post", route: "/user", controller: UserController_1.UserController, action: "save" },
    { method: "post", route: "/user/create", controller: UserController_1.UserController, action: "createUser" },
    { method: "delete", route: "/user/:id", controller: UserController_1.UserController, action: "remove" },
    //Recover
    { method: "post", route: "/user/recover", controller: UserController_1.UserController, action: "recoverMail" },
    { method: "post", route: "/user/reset", controller: UserController_1.UserController, action: "resetPassword" },
    //Recover - change
    { method: "post", route: "/user/changemail", controller: UserController_1.UserController, action: "changeEmail" },
    { method: "post", route: "/user/changepassword", controller: UserController_1.UserController, action: "changePassword" },
    //Auth
    { method: "post", route: "/user/auth", controller: UserController_1.UserController, action: "auth" },
    //Cliente
    { method: "get", route: "/client", controller: ClientController_1.ClientController, action: "all" },
    { method: "get", route: "/client/:id", controller: ClientController_1.ClientController, action: "one" },
    { method: "post", route: "/client/create", controller: ClientController_1.ClientController, action: "createClient" },
    { method: "post", route: "/client", controller: ClientController_1.ClientController, action: "save" },
    { method: "delete", route: "/client/:id", controller: ClientController_1.ClientController, action: "remove" },
    //farm
    { method: "get", route: "/farm", controller: FarmController_1.FarmController, action: "all" },
    { method: "get", route: "/farm/:id", controller: FarmController_1.FarmController, action: "one" },
    { method: "post", route: "/farm/create", controller: FarmController_1.FarmController, action: "createFarm" },
    { method: "post", route: "/farm", controller: FarmController_1.FarmController, action: "save" },
    { method: "delete", route: "/farm/:id", controller: FarmController_1.FarmController, action: "remove" },
    //farmref
    { method: "get", route: "/farmref/:id", controller: FarmRefController_1.FarmRefController, action: "one2" },
    { method: "post", route: "/farmref/create", controller: FarmRefController_1.FarmRefController, action: "createFarmRef" },
    { method: "post", route: "/farmref", controller: FarmRefController_1.FarmRefController, action: "save" },
    { method: "delete", route: "/farmref/:id", controller: FarmRefController_1.FarmRefController, action: "remove" },
    //farmref 2.0
    { method: "post", route: "/farmref/buscar/create", controller: FarmRefController_1.FarmRefController, action: "createFarmRefBUSCAR" },
    { method: "post", route: "/farmref/car/create", controller: FarmRefController_1.FarmRefController, action: "createFarmRefCAR" },
    //farm default
    { method: "post", route: "/farmdefaultref/create", controller: FarmRefController_1.FarmRefController, action: "setDefault" },
    { method: "get", route: "/farmdefaultref/:id", controller: FarmRefController_1.FarmRefController, action: "oneDefault" },
    { method: "get", route: "/farmreferences/:id", controller: FarmRefController_1.FarmRefController, action: "allRefFromFarm" },
    //query report
    { method: "post", route: "/queryreport/:id", controller: queryReportController_1.queryReportController, action: "createQueryReport" },
    { method: "get", route: "/getreport/:numCar/:anoRef", controller: queryReportController_1.queryReportController, action: "getQueryReport" },
    //query report 2.0
    { method: "post", route: "/queryreportbuscar/:id", controller: queryReportController_1.queryReportController, action: "createQueryReportBuscar" },
    { method: "post", route: "/queryreportcar/:numCar/:anoRef", controller: queryReportController_1.queryReportController, action: "createQueryReportCar" },
    //update maps
    { method: "get", route: "/updatemaps", controller: UpdateController_1.UpdateController, action: "updatemaps" },
    { method: "get", route: "/getlastupdate", controller: UpdateController_1.UpdateController, action: "getlastupdate" },
    //CARtelada
    { method: "post", route: "/cartelada/create", controller: CarteladaController_1.CarteladaController, action: "cartelada" },
    { method: "post", route: "/cartelada_v02/create", controller: CarteladaController_1.CarteladaController, action: "cartelada_v02" },
];
//# sourceMappingURL=routes.js.map