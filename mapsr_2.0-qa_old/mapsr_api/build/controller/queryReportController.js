"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryReportController = void 0;
var typeorm_1 = require("typeorm");
var BaseController_1 = require("./BaseController");
var jsonwebtoken_1 = require("jsonwebtoken");
var FarmReferece_1 = require("../entity/FarmReferece");
var User_1 = require("../entity/User");
var queryReport_1 = require("../entity/queryReport");
var statusQueryReport_1 = require("../entity/enum/statusQueryReport");
var config_1 = require("../configuration/config");
var fs = require('fs');
var R = require('r-integration');
var queryReportController = /** @class */ (function (_super) {
    __extends(queryReportController, _super);
    function queryReportController() {
        var _this = _super.call(this, FarmReferece_1.FarmReferece, false) || this;
        _this._repository_FarmReferece = (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece);
        _this._repository_QueryReport = (0, typeorm_1.getRepository)(queryReport_1.queryReport);
        _this._repository_User = (0, typeorm_1.getRepository)(User_1.User);
        return _this;
    }
    queryReportController.prototype.createQueryReportBuscar = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _farmReference, qResult, resultScript, _queryReportExecuted, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._repository_FarmReferece.findOne({
                            where: {
                                uid: request.params.id,
                            }
                        })];
                    case 1:
                        _farmReference = _a.sent();
                        if (!_farmReference)
                            return [2 /*return*/, { status: 400, errors: ['Referência não encontrada'] }];
                        qResult = new queryReport_1.queryReport();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        return [4 /*yield*/, this.executeRScriptBuscar(_farmReference.longitude, _farmReference.latitude, _farmReference.ano_referencia)];
                    case 3:
                        resultScript = _a.sent();
                        console.log('result script', resultScript);
                        console.log('result script [0]', resultScript[0]);
                        if (!resultScript) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._repository_QueryReport.findOne({
                                where: {
                                    numCar: resultScript[0],
                                },
                                relations: ['farmRef']
                            })];
                    case 4:
                        _queryReportExecuted = _a.sent();
                        console.log('result _queryReportExecuted', _queryReportExecuted);
                        console.log('result queryReportExecuted.ano_referencia', _queryReportExecuted.ano_referencia);
                        console.log('result _farmReference.ano_referencia', _farmReference.ano_referencia);
                        if (_queryReportExecuted != undefined && _queryReportExecuted.ano_referencia == _farmReference.ano_referencia) {
                            return [2 /*return*/, { status: 200, errors: ['Já existe pasta para este car e este ano', _queryReportExecuted] }];
                        }
                        qResult.farmRef = _farmReference.uid;
                        qResult.ano_referencia = _farmReference.ano_referencia;
                        qResult.statusQueryReport = statusQueryReport_1.statusQueryReport.concluida;
                        qResult.numCar = resultScript[0];
                        console.log('result script before save', qResult);
                        return [4 /*yield*/, this._repository_QueryReport.save(qResult)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, qResult];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        console.error("Erro ao Salvar ao salvar o buscar", error_1);
                        return [2 /*return*/, { status: 404, errors: ['Erro no processamento dos arquivos', error_1] }];
                    case 8: return [2 /*return*/, { status: 200, message: "Geração em andamento!" }];
                }
            });
        });
    };
    queryReportController.prototype.createQueryReportCar = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _farmReference;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('request.params.numCar', request.params.numCar);
                        console.log('request.params.anoRef', request.params.anoRef);
                        return [4 /*yield*/, this._repository_FarmReferece.findOne({
                                where: {
                                    numCar: request.params.numCar,
                                    ano_referencia: request.params.anoRef
                                }
                            })];
                    case 1:
                        _farmReference = _a.sent();
                        if (!_farmReference)
                            return [2 /*return*/, { status: 400, errors: { message: 'Referência não encontrada' } }];
                        this.executeQueryReport(request);
                        return [2 /*return*/, { status: 200, errors: { message: "Geração em andamento!" } }];
                }
            });
        });
    };
    queryReportController.prototype.createQueryReport = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _farmReference;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._repository_FarmReferece.findOne({
                            where: {
                                numCar: request.params.numCar,
                                ano_referencia: request.params.anoRef
                            }
                        })];
                    case 1:
                        _farmReference = _a.sent();
                        if (!_farmReference)
                            return [2 /*return*/, { status: 400, errors: { message: 'Referência não encontrada' } }];
                        this.executeQueryReport(request);
                        return [2 /*return*/, { status: 200, errors: "Geração em andamento!" }];
                }
            });
        });
    };
    queryReportController.prototype.executeQueryReport = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var qResult, _farmReference, queryExecuted, resultScript, ifInDB, ifInDB, error_2, ifInDB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qResult = new queryReport_1.queryReport();
                        return [4 /*yield*/, this._repository_FarmReferece.findOne({
                                where: {
                                    numCar: request.params.numCar,
                                    ano_referencia: request.params.anoRef
                                }
                            })];
                    case 1:
                        _farmReference = _a.sent();
                        if (!_farmReference)
                            return [2 /*return*/, { status: 400, errors: ['Referência não encontrada'] }];
                        return [4 /*yield*/, this._repository_QueryReport.findOne({
                                where: {
                                    numCar: request.params.numCar,
                                    ano_referencia: request.params.anoRef
                                }
                            })];
                    case 2:
                        queryExecuted = _a.sent();
                        console.log("query report queryExecuted", queryExecuted);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 13, , 15]);
                        return [4 /*yield*/, this.executeRScript(_farmReference.uid, queryExecuted.numCar, _farmReference.ano_referencia)];
                    case 4:
                        resultScript = _a.sent();
                        console.log("resultScript execucao arquivo", resultScript);
                        if (!(resultScript && resultScript[5] != 'error')) return [3 /*break*/, 8];
                        try {
                            this.executeRScriptDinamizado(_farmReference.uid, queryExecuted.numCar, _farmReference.ano_referencia);
                        }
                        catch (error) {
                            console.log("resultScript executeRScriptDinamizado error", error);
                        }
                        qResult.farmRef = _farmReference.uid;
                        qResult.result_geojson = "".concat(queryExecuted.numCar, ".GeoJSON");
                        qResult.result_csv = "".concat(queryExecuted.numCar, ".csv");
                        qResult.result_json = "".concat(queryExecuted.numCar, ".json");
                        qResult.statusQueryReport = statusQueryReport_1.statusQueryReport.concluida;
                        qResult.numCar = queryExecuted.numCar;
                        return [4 /*yield*/, this._repository_QueryReport.findOne({
                                where: {
                                    farmRef: _farmReference.uid
                                }
                            })];
                    case 5:
                        ifInDB = _a.sent();
                        if (!ifInDB) return [3 /*break*/, 7];
                        qResult.uid = ifInDB.uid;
                        return [4 /*yield*/, this._repository_QueryReport.save(qResult)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, qResult];
                    case 8:
                        qResult.farmRef = _farmReference.uid;
                        qResult.result_geojson = "".concat(queryExecuted.numCar, ".GeoJSON");
                        qResult.result_csv = "".concat(queryExecuted.numCar, ".csv");
                        qResult.result_json = "".concat(queryExecuted.numCar, ".json");
                        qResult.statusQueryReport = statusQueryReport_1.statusQueryReport.erro_arquivos;
                        qResult.numCar = queryExecuted.numCar;
                        qResult.erro_geracao_arquivo = resultScript[6];
                        return [4 /*yield*/, this._repository_QueryReport.findOne({
                                where: {
                                    farmRef: _farmReference.uid
                                }
                            })];
                    case 9:
                        ifInDB = _a.sent();
                        if (!ifInDB) return [3 /*break*/, 11];
                        qResult.uid = ifInDB.uid;
                        return [4 /*yield*/, this._repository_QueryReport.save(qResult)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/, qResult];
                    case 12: return [3 /*break*/, 15];
                    case 13:
                        error_2 = _a.sent();
                        console.error("Erro ao Salvar executando query report", error_2);
                        return [4 /*yield*/, this._repository_QueryReport.findOne({
                                where: {
                                    farmRef: _farmReference.uid
                                }
                            })];
                    case 14:
                        ifInDB = _a.sent();
                        if (ifInDB) {
                            qResult.uid = ifInDB.uid;
                        }
                        qResult.farmRef = _farmReference.uid;
                        qResult.statusQueryReport = statusQueryReport_1.statusQueryReport.erro_arquivos;
                        this._repository_QueryReport.save(qResult);
                        return [2 /*return*/, { status: 404, errors: ['Erro no processamento dos arquivos', error_2] }];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    queryReportController.prototype.getQueryReport = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var qResult, _farmReference, queryReportSaved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qResult = new queryReport_1.queryReport();
                        return [4 /*yield*/, this._repository_FarmReferece.findOne({
                                where: {
                                    numCar: request.params.numCar,
                                    ano_referencia: request.params.anoRef
                                }
                            })];
                    case 1:
                        _farmReference = _a.sent();
                        if (!_farmReference)
                            return [2 /*return*/, { status: 400, errors: ['Referência não encontrada (FarmReference)'] }];
                        return [4 /*yield*/, this._repository_QueryReport.findOne({
                                where: {
                                    numCar: request.params.numCar,
                                    ano_referencia: request.params.anoRef
                                }
                            })];
                    case 2:
                        queryReportSaved = _a.sent();
                        if (!queryReportSaved)
                            return [2 /*return*/, { status: 400, errors: ['Referência não encontrada (QueryReport)'] }];
                        qResult.farmRef = _farmReference.uid;
                        qResult.result_geojson = "".concat(_farmReference.numCar, ".GeoJSON");
                        qResult.result_csv = "".concat(_farmReference.numCar, ".csv");
                        qResult.result_json = "".concat(_farmReference.numCar, ".json");
                        qResult.upadateAt = queryReportSaved.upadateAt;
                        qResult.statusQueryReport = queryReportSaved.statusQueryReport;
                        qResult.erro_geracao_arquivo = queryReportSaved.erro_geracao_arquivo;
                        return [2 /*return*/, qResult];
                }
            });
        });
    };
    queryReportController.prototype.one = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this._repository_QueryReport.find({
                            where: {
                                deleted: false,
                                uid: request.params.id,
                            }
                        })];
                }
                catch (_b) {
                    return [2 /*return*/, { status: 404, errors: ['Fazenda não encontrada'] }];
                }
                return [2 /*return*/];
            });
        });
    };
    queryReportController.prototype.executeRScript = function (fileName, fcar, ano_referencia) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R", "ConsultaCAR", { fcar: fcar, ano_referencia: ano_referencia, versao_biomas: "v08", geoJson: "TRUE" })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    queryReportController.prototype.executeRScriptDinamizado = function (fileName, fcar, ano_referencia) {
        return __awaiter(this, void 0, void 0, function () {
            var dinamizado;
            return __generator(this, function (_a) {
                dinamizado = R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR-Dinamizada.R", "dinamizar", { fcar: fcar, ano_referencia: ano_referencia, versao_biomas: "v08" });
                return [2 /*return*/, dinamizado];
            });
        });
    };
    queryReportController.prototype.executeRScriptBuscar = function (longitude, latitude, ano_referencia) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R", "busCAR", { longitude: longitude, latitude: latitude, ano_referencia: ano_referencia, versao_biomas: "v08" })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    queryReportController.prototype._validateToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var _userToken, _user, error_3, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!token) return [3 /*break*/, 8];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        _userToken = (0, jsonwebtoken_1.verify)(token, config_1.default.secretyKey);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._repository_User.findOne({ email: _userToken.email })];
                    case 3:
                        _user = _a.sent();
                        if (_user) {
                            return [2 /*return*/, _userToken];
                        }
                        else {
                            return [2 /*return*/, { status: 400, errors: ['Usuário nao encontrado'] }];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_4 = _a.sent();
                        return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 7: return [3 /*break*/, 9];
                    case 8: //se nao enviado token, recusa acesso
                    return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return queryReportController;
}(BaseController_1.BaseController));
exports.queryReportController = queryReportController;
//# sourceMappingURL=queryReportController.js.map