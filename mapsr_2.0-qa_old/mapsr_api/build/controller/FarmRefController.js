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
exports.FarmRefController = void 0;
var typeorm_1 = require("typeorm");
var BaseController_1 = require("./BaseController");
var jsonwebtoken_1 = require("jsonwebtoken");
var Farm_1 = require("../entity/Farm");
var FarmReferece_1 = require("../entity/FarmReferece");
var User_1 = require("../entity/User");
var fileHelper_1 = require("../helpers/fileHelper");
var farmDefaultReference_1 = require("../entity/farmDefaultReference");
var queryReport_1 = require("../entity/queryReport");
var statusQueryReport_1 = require("../entity/enum/statusQueryReport");
var config_1 = require("../configuration/config");
var queryReportResultModel_1 = require("../helpers/queryReportResultModel");
var R = require('r-integration');
var FarmRefController = /** @class */ (function (_super) {
    __extends(FarmRefController, _super);
    function FarmRefController() {
        var _this = _super.call(this, FarmReferece_1.FarmReferece, false) || this;
        _this._repository_FarmReferece = (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece);
        _this._repository_FarmDefaultReferece = (0, typeorm_1.getRepository)(farmDefaultReference_1.farmDefaultReference);
        _this._repository_QueryReport = (0, typeorm_1.getRepository)(queryReport_1.queryReport);
        _this._repository_User = (0, typeorm_1.getRepository)(User_1.User);
        return _this;
    }
    FarmRefController.prototype.createFarmRefBUSCAR = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, longitude, latitude, ano_referencia, numCar, token, _userAuth, _farmRef, _farmRefSaved, qResult, queryReportResultModel, resultScript, repo, _queryReportExecuted, folderExistsGeoJson, folderExistsCSV, folderExistsJson, repo, _queryReportExecutedWithCar, folderExistsGeoJson, folderExistsCSV, folderExistsJson, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, longitude = _a.longitude, latitude = _a.latitude, ano_referencia = _a.ano_referencia, numCar = _a.numCar;
                        console.log('numcar', numCar);
                        if (!ano_referencia)
                            return [2 /*return*/, { status: 400, errors: ['Preencha o ano referencia'] }];
                        if (!longitude && !latitude && !numCar)
                            return [2 /*return*/, { status: 400, errors: ['Preencha o número do car ou latitude e longitude para realizar a consulta.'] }];
                        if (!numCar) {
                            if (!longitude)
                                return [2 /*return*/, { status: 400, errors: ['Preencha a Longitude'] }];
                            if (!latitude)
                                return [2 /*return*/, { status: 400, errors: ['Preencha a Latitude'] }];
                        }
                        token = request.body.token || request.query.token || request.headers['x-token-access'];
                        _userAuth = this._validateToken(token);
                        _farmRef = request.body;
                        _farmRef.requestingUser = _userAuth.uid;
                        _farmRef.longitude = longitude;
                        _farmRef.latitude = latitude;
                        _farmRef.ano_referencia = ano_referencia;
                        _farmRef.numCar = numCar;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 21, , 22]);
                        qResult = new queryReport_1.queryReport();
                        queryReportResultModel = new queryReportResultModel_1.QueryReportResultModel();
                        if (!!numCar) return [3 /*break*/, 12];
                        resultScript = void 0;
                        return [4 /*yield*/, this.executeRScriptBuscar(longitude, latitude, ano_referencia)];
                    case 2:
                        resultScript = _b.sent();
                        if (!(resultScript && resultScript[5] != 'error')) return [3 /*break*/, 10];
                        _farmRef.numCar = resultScript[5];
                        repo = (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece);
                        return [4 /*yield*/, repo.save(_farmRef)];
                    case 3:
                        _farmRefSaved = _b.sent();
                        return [4 /*yield*/, this._repository_QueryReport.findOne({
                                where: {
                                    numCar: resultScript[5],
                                    ano_referencia: ano_referencia
                                }
                            })];
                    case 4:
                        _queryReportExecuted = _b.sent();
                        console.log('passou por aqui ...');
                        if (!(_queryReportExecuted != undefined && _queryReportExecuted.ano_referencia == _farmRefSaved.ano_referencia)) return [3 /*break*/, 8];
                        return [4 /*yield*/, fileHelper_1.FileHelper.validFolderExistAsync(_queryReportExecuted.ano_referencia, "geoJson", _queryReportExecuted.numCar + ".GeoJSON")];
                    case 5:
                        folderExistsGeoJson = _b.sent();
                        return [4 /*yield*/, fileHelper_1.FileHelper.validFolderExistAsync(_queryReportExecuted.ano_referencia, "csv", _queryReportExecuted.numCar + ".csv")];
                    case 6:
                        folderExistsCSV = _b.sent();
                        return [4 /*yield*/, fileHelper_1.FileHelper.validFolderExistAsync(_queryReportExecuted.ano_referencia, "json", _queryReportExecuted.numCar + ".json")];
                    case 7:
                        folderExistsJson = _b.sent();
                        queryReportResultModel.numCar = _queryReportExecuted.numCar;
                        queryReportResultModel.ano_referencia = _queryReportExecuted.ano_referencia;
                        queryReportResultModel.createAt = _queryReportExecuted.createAt;
                        queryReportResultModel.statusQueryReport = _queryReportExecuted.statusQueryReport;
                        queryReportResultModel.statusCSV = folderExistsGeoJson ? "Arquivo já existe" : "Arquivo não existe.";
                        queryReportResultModel.statusGEOJSON = folderExistsCSV ? "Arquivo já existe" : "Arquivo não existe.";
                        queryReportResultModel.statusJson = folderExistsJson ? "Arquivo já existe" : "Arquivo não existe.";
                        queryReportResultModel.uuid = _queryReportExecuted.uid;
                        console.log('retorno 1', queryReportResultModel);
                        return [2 /*return*/, { status: 200, errors: queryReportResultModel }];
                    case 8:
                        qResult.farmRef = _farmRefSaved.uid;
                        qResult.ano_referencia = _farmRefSaved.ano_referencia;
                        qResult.statusQueryReport = statusQueryReport_1.statusQueryReport.recebida;
                        qResult.numCar = resultScript[5];
                        return [4 /*yield*/, this._repository_QueryReport.save(qResult)];
                    case 9:
                        _b.sent();
                        queryReportResultModel.numCar = resultScript[5];
                        queryReportResultModel.ano_referencia = _farmRefSaved.ano_referencia;
                        queryReportResultModel.createAt = qResult.createAt;
                        queryReportResultModel.statusQueryReport = statusQueryReport_1.statusQueryReport.recebida;
                        queryReportResultModel.statusCSV = "Arquivo não existe.";
                        queryReportResultModel.statusGEOJSON = "Arquivo não existe.";
                        queryReportResultModel.statusJson = "Arquivo não existe.";
                        queryReportResultModel.uuid = qResult.uid;
                        console.log('retorno 2', queryReportResultModel);
                        return [2 /*return*/, { status: 200, errors: queryReportResultModel }];
                    case 10: return [2 /*return*/, { status: 400, errors: ['Erro na geração do car, code error:', resultScript[6]] }];
                    case 11: return [3 /*break*/, 20];
                    case 12:
                        repo = (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece);
                        return [4 /*yield*/, repo.save(_farmRef)];
                    case 13:
                        _farmRefSaved = _b.sent();
                        return [4 /*yield*/, this._repository_QueryReport.findOne({
                                where: {
                                    numCar: numCar,
                                    ano_referencia: ano_referencia
                                }
                            })];
                    case 14:
                        _queryReportExecutedWithCar = _b.sent();
                        if (!(_queryReportExecutedWithCar != undefined && _queryReportExecutedWithCar.ano_referencia == ano_referencia)) return [3 /*break*/, 18];
                        return [4 /*yield*/, fileHelper_1.FileHelper.validFolderExistAsync(_queryReportExecutedWithCar.ano_referencia, "geoJson", _queryReportExecutedWithCar.numCar + ".GeoJSON")];
                    case 15:
                        folderExistsGeoJson = _b.sent();
                        return [4 /*yield*/, fileHelper_1.FileHelper.validFolderExistAsync(_queryReportExecutedWithCar.ano_referencia, "csv", _queryReportExecutedWithCar.numCar + ".csv")];
                    case 16:
                        folderExistsCSV = _b.sent();
                        return [4 /*yield*/, fileHelper_1.FileHelper.validFolderExistAsync(_queryReportExecutedWithCar.ano_referencia, "json", _queryReportExecutedWithCar.numCar + ".json")];
                    case 17:
                        folderExistsJson = _b.sent();
                        queryReportResultModel.numCar = _queryReportExecutedWithCar.numCar;
                        queryReportResultModel.ano_referencia = _queryReportExecutedWithCar.ano_referencia;
                        queryReportResultModel.createAt = _queryReportExecutedWithCar.createAt;
                        queryReportResultModel.statusQueryReport = _queryReportExecutedWithCar.statusQueryReport;
                        queryReportResultModel.statusCSV = folderExistsGeoJson ? "Arquivo já existe" : "Arquivo não existe.";
                        queryReportResultModel.statusGEOJSON = folderExistsCSV ? "Arquivo já existe" : "Arquivo não existe.";
                        queryReportResultModel.statusJson = folderExistsJson ? "Arquivo já existe" : "Arquivo não existe.";
                        queryReportResultModel.uuid = _queryReportExecutedWithCar.uid;
                        console.log('retorno 3', queryReportResultModel);
                        return [2 /*return*/, { status: 200, errors: queryReportResultModel }];
                    case 18:
                        qResult.farmRef = _farmRefSaved.uid;
                        qResult.ano_referencia = _farmRefSaved.ano_referencia;
                        qResult.statusQueryReport = statusQueryReport_1.statusQueryReport.recebida;
                        qResult.numCar = numCar;
                        return [4 /*yield*/, this._repository_QueryReport.save(qResult)];
                    case 19:
                        _b.sent();
                        queryReportResultModel.numCar = numCar;
                        queryReportResultModel.ano_referencia = ano_referencia;
                        queryReportResultModel.createAt = qResult.createAt;
                        queryReportResultModel.statusQueryReport = statusQueryReport_1.statusQueryReport.recebida;
                        queryReportResultModel.statusCSV = "Arquivo não existe.";
                        queryReportResultModel.statusGEOJSON = "Arquivo não existe.";
                        queryReportResultModel.statusJson = "Arquivo não existe.";
                        queryReportResultModel.uuid = qResult.uid;
                        console.log('retorno 4', queryReportResultModel);
                        return [2 /*return*/, { status: 200, errors: queryReportResultModel }];
                    case 20: return [3 /*break*/, 22];
                    case 21:
                        err_1 = _b.sent();
                        console.log('err.message :>> ', err_1.message);
                        return [2 /*return*/, { status: 400, errors: ['Erro ao salvar'] }];
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    FarmRefController.prototype.createFarmRefCAR = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, fcar, ano_referencia, token, _userAuth, _farmRef, res, repo, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, fcar = _a.fcar, ano_referencia = _a.ano_referencia;
                        if (!fcar)
                            return [2 /*return*/, { status: 400, errors: ['Preencha o Fcar'] }];
                        if (!ano_referencia)
                            return [2 /*return*/, { status: 400, errors: ['Preencha o Ano Referencia'] }];
                        token = request.body.token || request.query.token || request.headers['x-token-access'];
                        _userAuth = this._validateToken(token);
                        _farmRef = request.body;
                        _farmRef.requestingUser = _userAuth.uid;
                        _farmRef.fcar = fcar;
                        _farmRef.ano_referencia = ano_referencia;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        repo = (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece);
                        return [4 /*yield*/, repo.save(_farmRef)];
                    case 2:
                        res = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        console.log('err.message :>> ', err_2.message);
                        return [2 /*return*/, { status: 400, errors: ['Erro ao salvar'] }];
                    case 4: return [2 /*return*/, res];
                }
            });
        });
    };
    FarmRefController.prototype.createFarmRef = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, referenceName, farmId, car_shp, car_shx, car_prj, car_dbf, app_shp, app_shx, app_prj, app_dbf, biomas, token, _userAuth, _farmRef, file, fileName, error_1, error_2, error_3, res, repo, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, referenceName = _a.referenceName, farmId = _a.farmId, car_shp = _a.car_shp, car_shx = _a.car_shx, car_prj = _a.car_prj, car_dbf = _a.car_dbf, app_shp = _a.app_shp, app_shx = _a.app_shx, app_prj = _a.app_prj, app_dbf = _a.app_dbf, biomas = _a.biomas;
                        if (!referenceName)
                            return [2 /*return*/, { status: 400, errors: ['Preencha o nome da Referência'] }];
                        if (!car_shp || !car_shx || !car_prj || !car_dbf)
                            return [2 /*return*/, { status: 400, errors: ['Adicione todos arquivos Car'] }];
                        if (!app_shp || !app_shx || !app_prj || !app_dbf)
                            return [2 /*return*/, { status: 400, errors: ['Adicione todos arquivos App'] }];
                        if (!biomas)
                            return [2 /*return*/, { status: 400, errors: ['Adicione o arquivo Biomas'] }];
                        token = request.body.token || request.query.token || request.headers['x-token-access'];
                        _userAuth = this._validateToken(token);
                        _farmRef = request.body;
                        _farmRef.requestingUser = _userAuth.uid;
                        file = '';
                        fileName = '';
                        if (!_farmRef.app_shp) return [3 /*break*/, 10];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(app_shp, 'shp', null)];
                    case 2:
                        file = _b.sent();
                        fileName = file.substring(0, file.length - 4);
                        _farmRef.app_shp = file;
                        if (!_farmRef.app_dbf) return [3 /*break*/, 4];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(app_dbf, 'dbf', fileName)];
                    case 3:
                        file = _b.sent();
                        _farmRef.app_dbf = file;
                        _b.label = 4;
                    case 4:
                        if (!_farmRef.app_prj) return [3 /*break*/, 6];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(app_prj, 'prj', fileName)];
                    case 5:
                        file = _b.sent();
                        _farmRef.app_prj = file;
                        _b.label = 6;
                    case 6:
                        if (!_farmRef.app_shx) return [3 /*break*/, 8];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(app_shx, 'shx', fileName)];
                    case 7:
                        file = _b.sent();
                        _farmRef.app_shx = file;
                        _b.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _b.sent();
                        console.log('erro base64', error_1);
                        return [3 /*break*/, 10];
                    case 10:
                        if (!_farmRef.biomas) return [3 /*break*/, 14];
                        _b.label = 11;
                    case 11:
                        _b.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(biomas, 'tif', null)];
                    case 12:
                        file = _b.sent();
                        _farmRef.biomas = file;
                        return [3 /*break*/, 14];
                    case 13:
                        error_2 = _b.sent();
                        return [3 /*break*/, 14];
                    case 14:
                        if (!_farmRef.car_shp) return [3 /*break*/, 24];
                        _b.label = 15;
                    case 15:
                        _b.trys.push([15, 23, , 24]);
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(car_shp, 'shp', null)];
                    case 16:
                        file = _b.sent();
                        fileName = file.substring(0, file.length - 4);
                        _farmRef.car_shp = file;
                        if (!_farmRef.car_dbf) return [3 /*break*/, 18];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(car_dbf, 'dbf', fileName)];
                    case 17:
                        file = _b.sent();
                        _farmRef.car_dbf = file;
                        _b.label = 18;
                    case 18:
                        if (!_farmRef.car_prj) return [3 /*break*/, 20];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(car_prj, 'prj', fileName)];
                    case 19:
                        file = _b.sent();
                        _farmRef.car_prj = file;
                        _b.label = 20;
                    case 20:
                        if (!_farmRef.car_shx) return [3 /*break*/, 22];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(car_shx, 'shx', fileName)];
                    case 21:
                        file = _b.sent();
                        _farmRef.car_shx = file;
                        _b.label = 22;
                    case 22: return [3 /*break*/, 24];
                    case 23:
                        error_3 = _b.sent();
                        console.log('erro base64', error_3);
                        return [3 /*break*/, 24];
                    case 24:
                        _b.trys.push([24, 26, , 27]);
                        repo = (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece);
                        return [4 /*yield*/, repo.save(_farmRef)];
                    case 25:
                        res = _b.sent();
                        return [3 /*break*/, 27];
                    case 26:
                        err_3 = _b.sent();
                        console.log('err.message :>> ', err_3.message);
                        return [2 /*return*/, { status: 400, errors: ['Erro ao salvar'] }];
                    case 27: return [2 /*return*/, res];
                }
            });
        });
    };
    FarmRefController.prototype.one2 = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (this.checkNotPermission(request))
                        return [2 /*return*/, this.errorRoot];
                    return [2 /*return*/, this._repository_FarmReferece.findOne({
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
    FarmRefController.prototype.save = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, uid, referenceName, farmId, car_shp, car_shx, car_prj, car_dbf, app_shp, app_shx, app_prj, app_dbf, biomas, _farmRef, validate, validate1, validate2, file, fileName, error_4, error_5, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, uid = _a.uid, referenceName = _a.referenceName, farmId = _a.farmId, car_shp = _a.car_shp, car_shx = _a.car_shx, car_prj = _a.car_prj, car_dbf = _a.car_dbf, app_shp = _a.app_shp, app_shx = _a.app_shx, app_prj = _a.app_prj, app_dbf = _a.app_dbf, biomas = _a.biomas;
                        if (!referenceName)
                            return [2 /*return*/, { status: 400, errors: ['Preencha o nome da Referência'] }];
                        if (!car_shp || !car_shx || !car_prj || !car_dbf)
                            return [2 /*return*/, { status: 400, errors: ['Adicione todos arquivos Car'] }];
                        if (!app_shp || !app_shx || !app_prj || !app_dbf)
                            return [2 /*return*/, { status: 400, errors: ['Adicione todos arquivos App'] }];
                        if (!biomas)
                            return [2 /*return*/, { status: 400, errors: ['Adicione o arquivo Biomas'] }];
                        _farmRef = request.body;
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece).findOne({ uid: uid })];
                    case 1:
                        validate = _b.sent();
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece).findOne({ uid: uid, deleted: true })];
                    case 2:
                        validate1 = _b.sent();
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(Farm_1.Farm).findOne({ uid: farmId })];
                    case 3:
                        validate2 = _b.sent();
                        if (!validate2)
                            return [2 /*return*/, { status: 400, errors: ['Fazenda não encontrada'] }];
                        if (validate) {
                            //se já estiver cadastrado (tiver uid), passa
                            _farmRef.uid = uid;
                        }
                        else if (validate1) {
                            _farmRef.deleted = false;
                            _farmRef.uid = validate1.uid;
                        }
                        if (!validate2) {
                            return [2 /*return*/, { status: 404, errors: ['Fazenda não encontrada'] }];
                        }
                        file = '';
                        fileName = '';
                        if (!_farmRef.app_shp) return [3 /*break*/, 13];
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 12, , 13]);
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(app_shp, 'shp', null)];
                    case 5:
                        file = _b.sent();
                        fileName = file.substring(0, file.length - 4);
                        _farmRef.app_shp = file;
                        if (!_farmRef.app_dbf) return [3 /*break*/, 7];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(app_shp, 'dbf', fileName)];
                    case 6:
                        file = _b.sent();
                        _farmRef.app_shp = file;
                        _b.label = 7;
                    case 7:
                        if (!_farmRef.app_prj) return [3 /*break*/, 9];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(app_shp, 'prj', fileName)];
                    case 8:
                        file = _b.sent();
                        _farmRef.app_prj = file;
                        _b.label = 9;
                    case 9:
                        if (!_farmRef.app_shx) return [3 /*break*/, 11];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(app_shp, 'shx', fileName)];
                    case 10:
                        file = _b.sent();
                        _farmRef.app_shx = file;
                        _b.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_4 = _b.sent();
                        console.log('erro base64', error_4);
                        return [3 /*break*/, 13];
                    case 13:
                        if (!_farmRef.biomas) return [3 /*break*/, 15];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(biomas, 'tif', null)];
                    case 14:
                        file = _b.sent();
                        fileName = file.substring(0, file.length - 4);
                        _farmRef.app_shp = file;
                        _b.label = 15;
                    case 15:
                        if (!_farmRef.car_shp) return [3 /*break*/, 25];
                        _b.label = 16;
                    case 16:
                        _b.trys.push([16, 24, , 25]);
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(car_shp, 'shp', null)];
                    case 17:
                        file = _b.sent();
                        fileName = file.substring(0, file.length - 4);
                        _farmRef.car_shp = file;
                        if (!_farmRef.car_dbf) return [3 /*break*/, 19];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(car_shp, 'dbf', fileName)];
                    case 18:
                        file = _b.sent();
                        _farmRef.car_shp = file;
                        _b.label = 19;
                    case 19:
                        if (!_farmRef.car_prj) return [3 /*break*/, 21];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(car_shp, 'prj', fileName)];
                    case 20:
                        file = _b.sent();
                        _farmRef.car_prj = file;
                        _b.label = 21;
                    case 21:
                        if (!_farmRef.car_shx) return [3 /*break*/, 23];
                        return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(car_shp, 'shx', fileName)];
                    case 22:
                        file = _b.sent();
                        _farmRef.car_shx = file;
                        _b.label = 23;
                    case 23: return [3 /*break*/, 25];
                    case 24:
                        error_5 = _b.sent();
                        console.log('erro base64', error_5);
                        return [3 /*break*/, 25];
                    case 25: return [4 /*yield*/, this._repository_FarmReferece.save(_farmRef)];
                    case 26:
                        res = _b.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    ;
    FarmRefController.prototype.setDefault = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, farmId, defaultReference, validate1, validate3, validate2, validate4, _farmDefaultRef, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, farmId = _a.farmId, defaultReference = _a.defaultReference;
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(farmDefaultReference_1.farmDefaultReference).findOne({ farmId: farmId })];
                    case 1:
                        validate1 = _b.sent();
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(Farm_1.Farm).findOne({ uid: farmId })];
                    case 2:
                        validate3 = _b.sent();
                        if (!validate3) {
                            return [2 /*return*/, { status: 404, errors: ['Fazenda não encontrada'] }];
                        }
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece).findOne({ farmId: farmId, uid: defaultReference })];
                    case 3:
                        validate2 = _b.sent();
                        if (!!validate2) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece).findOne({ uid: defaultReference })];
                    case 4:
                        validate4 = _b.sent();
                        if (validate4) {
                            return [2 /*return*/, { status: 404, errors: ['Referência não corresponde a fazenda informada'] }];
                        }
                        else {
                            return [2 /*return*/, { status: 404, errors: ['Referência não encontrada '] }];
                        }
                        _b.label = 5;
                    case 5:
                        _farmDefaultRef = new farmDefaultReference_1.farmDefaultReference();
                        if (validate1) {
                            //se já estiver cadastrado (tiver uid)
                            _farmDefaultRef.uid = validate1.uid;
                        }
                        _farmDefaultRef.farmId = farmId;
                        _farmDefaultRef.defaultReference = defaultReference;
                        return [4 /*yield*/, this._repository_FarmDefaultReferece.save(_farmDefaultRef)];
                    case 6:
                        res = _b.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    ;
    FarmRefController.prototype.oneDefault = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._repository_FarmDefaultReferece.findOne({
                                where: {
                                    farmId: request.params.id,
                                }
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, { status: 404, errors: ['Fazenda não encontrada'] }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FarmRefController.prototype.allRefFromFarm = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._repository_FarmReferece.find({
                                where: {
                                    farmId: request.params.id,
                                }
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, { status: 404, errors: ['Fazenda não encontrada'] }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FarmRefController.prototype._validateToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var _userToken, _user, error_6, error_7;
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
                            //ok, passa
                            return [2 /*return*/, _userToken];
                        }
                        else {
                            return [2 /*return*/, { status: 400, errors: ['Usuário nao encontrado'] }];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_6 = _a.sent();
                        console.log(error_6);
                        return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_7 = _a.sent();
                        return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 7: return [3 /*break*/, 9];
                    case 8: //se nao enviado token, recusa acesso
                    return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    FarmRefController.prototype.executeRScriptBuscar = function (longitude, latitude, ano_referencia) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R", "busCAR", { longitude: longitude, latitude: latitude, ano_referencia: ano_referencia, versao_biomas: "v07" })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return FarmRefController;
}(BaseController_1.BaseController));
exports.FarmRefController = FarmRefController;
//# sourceMappingURL=FarmRefController.js.map