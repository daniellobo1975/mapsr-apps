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
exports.FarmController = void 0;
var typeorm_1 = require("typeorm");
var BaseController_1 = require("./BaseController");
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../configuration/config");
var Client_1 = require("../entity/Client");
var Farm_1 = require("../entity/Farm");
var FarmReferece_1 = require("../entity/FarmReferece");
var User_1 = require("../entity/User");
var fileHelper_1 = require("../helpers/fileHelper");
var FarmController = /** @class */ (function (_super) {
    __extends(FarmController, _super);
    function FarmController() {
        var _this = _super.call(this, Farm_1.Farm, false) || this;
        _this._repository_Farm = (0, typeorm_1.getRepository)(Farm_1.Farm);
        _this._repository_FarmReferece = (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece);
        _this._repository_User = (0, typeorm_1.getRepository)(User_1.User);
        return _this;
    }
    FarmController.prototype.createFarm = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, farmName, fCar, clientId, token, _userAuth, _farm, res, repo, err_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, farmName = _a.farmName, fCar = _a.fCar, clientId = _a.clientId;
                        if (!farmName)
                            return [2 /*return*/, { status: 400, errors: ['Preencha o nome da Fazenda'] }];
                        if (!fCar)
                            return [2 /*return*/, { status: 400, errors: ['Código Fcar não encontrado'] }];
                        if (!clientId)
                            return [2 /*return*/, { status: 400, errors: ['Cliente  não encontrado'] }];
                        token = request.body.token || request.query.token || request.headers['x-token-access'];
                        _userAuth = this._validateToken(token);
                        _userAuth = _userAuth.uid;
                        _farm = request.body;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        repo = (0, typeorm_1.getRepository)(Farm_1.Farm);
                        return [4 /*yield*/, repo.save(_farm)];
                    case 2:
                        res = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        console.log('err.message :>> ', err_1.message);
                        return [3 /*break*/, 4];
                    case 4:
                        if (!_farm.farmReferences) return [3 /*break*/, 6];
                        return [4 /*yield*/, Promise.all(_farm.farmReferences.map(function (farmRef) { return __awaiter(_this, void 0, void 0, function () {
                                var file, fileName, error_1, error_2, error_3, repo2, res3, err_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            farmRef.farmId = _farm.uid;
                                            farmRef.requestingUser = _userAuth.uid;
                                            farmRef.farmId = _farm.uid;
                                            farmRef.requestingUser = _userAuth.uid;
                                            if (!farmRef.referenceName)
                                                return [2 /*return*/, { status: 400, errors: ['Preencha o nome da Referência'] }];
                                            if (!farmRef.car_shp || !farmRef.car_shx || !farmRef.car_prj || !farmRef.car_dbf)
                                                return [2 /*return*/, { status: 400, errors: ['Adicione todos arquivos Car'] }];
                                            if (!farmRef.app_shp || !farmRef.app_shx || !farmRef.app_prj || !farmRef.app_dbf)
                                                return [2 /*return*/, { status: 400, errors: ['Adicione todos arquivos App'] }];
                                            if (!farmRef.biomas)
                                                return [2 /*return*/, { status: 400, errors: ['Adicione o arquivo Biomas'] }];
                                            file = '';
                                            fileName = '';
                                            if (!farmRef.app_shp) return [3 /*break*/, 10];
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 9, , 10]);
                                            return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(farmRef.app_shp, 'shp', null)];
                                        case 2:
                                            file = _a.sent();
                                            fileName = file.substring(0, file.length - 4);
                                            farmRef.app_shp = file;
                                            if (!farmRef.app_dbf) return [3 /*break*/, 4];
                                            return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(farmRef.app_dbf, 'dbf', fileName)];
                                        case 3:
                                            file = _a.sent();
                                            farmRef.app_dbf = file;
                                            _a.label = 4;
                                        case 4:
                                            if (!farmRef.app_prj) return [3 /*break*/, 6];
                                            return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(farmRef.app_prj, 'prj', fileName)];
                                        case 5:
                                            file = _a.sent();
                                            farmRef.app_prj = file;
                                            _a.label = 6;
                                        case 6:
                                            if (!farmRef.app_shx) return [3 /*break*/, 8];
                                            return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(farmRef.app_shx, 'shx', fileName)];
                                        case 7:
                                            file = _a.sent();
                                            farmRef.app_shx = file;
                                            _a.label = 8;
                                        case 8: return [3 /*break*/, 10];
                                        case 9:
                                            error_1 = _a.sent();
                                            console.log('erro base64', error_1);
                                            return [3 /*break*/, 10];
                                        case 10:
                                            if (!farmRef.biomas) return [3 /*break*/, 14];
                                            _a.label = 11;
                                        case 11:
                                            _a.trys.push([11, 13, , 14]);
                                            return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(farmRef.biomas, 'tif', null)];
                                        case 12:
                                            file = _a.sent();
                                            // fileName = file.substring(0, file.length-4);
                                            farmRef.biomas = file;
                                            return [3 /*break*/, 14];
                                        case 13:
                                            error_2 = _a.sent();
                                            return [3 /*break*/, 14];
                                        case 14:
                                            if (!farmRef.car_shp) return [3 /*break*/, 24];
                                            _a.label = 15;
                                        case 15:
                                            _a.trys.push([15, 23, , 24]);
                                            return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(farmRef.car_shp, 'shp', null)];
                                        case 16:
                                            file = _a.sent();
                                            fileName = file.substring(0, file.length - 4);
                                            farmRef.car_shp = file;
                                            if (!farmRef.car_dbf) return [3 /*break*/, 18];
                                            return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(farmRef.car_dbf, 'dbf', fileName)];
                                        case 17:
                                            file = _a.sent();
                                            farmRef.car_dbf = file;
                                            _a.label = 18;
                                        case 18:
                                            if (!farmRef.car_prj) return [3 /*break*/, 20];
                                            return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(farmRef.car_prj, 'prj', fileName)];
                                        case 19:
                                            file = _a.sent();
                                            farmRef.car_prj = file;
                                            _a.label = 20;
                                        case 20:
                                            if (!farmRef.car_shx) return [3 /*break*/, 22];
                                            return [4 /*yield*/, fileHelper_1.FileHelper.fileBase64(farmRef.car_shx, 'shx', fileName)];
                                        case 21:
                                            file = _a.sent();
                                            farmRef.car_shx = file;
                                            _a.label = 22;
                                        case 22: return [3 /*break*/, 24];
                                        case 23:
                                            error_3 = _a.sent();
                                            console.log('erro base64', error_3);
                                            return [3 /*break*/, 24];
                                        case 24:
                                            repo2 = (0, typeorm_1.getRepository)(FarmReferece_1.FarmReferece);
                                            _a.label = 25;
                                        case 25:
                                            _a.trys.push([25, 27, , 28]);
                                            return [4 /*yield*/, repo2.save(farmRef)];
                                        case 26:
                                            res3 = _a.sent();
                                            return [3 /*break*/, 28];
                                        case 27:
                                            err_2 = _a.sent();
                                            return [2 /*return*/, { status: 400, errors: ['Dados incompletos Complemento Referência Fazenda:', farmRef] }];
                                        case 28: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, res];
                }
            });
        });
    };
    FarmController.prototype.one2 = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (this.checkNotPermission(request))
                        return [2 /*return*/, this.errorRoot];
                    return [2 /*return*/, this._repository_Farm.find({
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
    FarmController.prototype.save = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, uid, farmName, clientId, fCar, email, phone, addressCEP, addressPlace, addressNumber, addressDistrict, addressComplement, addressCity, _farm, validate, validate1, validate2, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, uid = _a.uid, farmName = _a.farmName, clientId = _a.clientId, fCar = _a.fCar, email = _a.email, phone = _a.phone, addressCEP = _a.addressCEP, addressPlace = _a.addressPlace, addressNumber = _a.addressNumber, addressDistrict = _a.addressDistrict, addressComplement = _a.addressComplement, addressCity = _a.addressCity;
                        //     return { status: 400, errors: ['Selecione a forma de pagamento'] }
                        if (!farmName)
                            return [2 /*return*/, { status: 400, errors: ['Preencha o nome da Fazenda'] }];
                        if (!fCar)
                            return [2 /*return*/, { status: 400, errors: ['Preencha o código Fcar da Fazenda'] }];
                        _farm = request.body;
                        console.log("🚀 ~ file: FarmController.ts ~ line 70 ~ FarmController ~ save ~ _farm", _farm);
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(Farm_1.Farm).findOne({ uid: uid })];
                    case 1:
                        validate = _b.sent();
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(Farm_1.Farm).findOne({ uid: uid, deleted: true })];
                    case 2:
                        validate1 = _b.sent();
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(Client_1.Client).findOne({ uid: clientId })];
                    case 3:
                        validate2 = _b.sent();
                        if (!validate2)
                            return [2 /*return*/, { status: 400, errors: ['cliente vinculado à Fazenda não encontrado'] }];
                        if (validate) {
                            //se já estiver cadastrado (tiver uid), passa
                        }
                        else if (validate1) {
                            _farm.deleted = false;
                            _farm.uid = validate1.uid;
                        }
                        else {
                            return [2 /*return*/, { status: 404, errors: ['Fazenda não encontrada'] }];
                        }
                        return [4 /*yield*/, this.repostitory.save(_farm)];
                    case 4:
                        res = _b.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    ;
    FarmController.prototype._validateToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var _userToken, _user, error_4, error_5;
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
                            // if (_user.isRoot === false) {
                            //     return { status: 400, errors: ['Você não possui permissão para acessar tal recurso'] }
                            // }
                        }
                        else {
                            return [2 /*return*/, { status: 400, errors: ['Usuário nao encontrado'] }];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        console.log(error_4);
                        return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_5 = _a.sent();
                        return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 7: return [3 /*break*/, 9];
                    case 8: //se nao enviado token, recusa acesso
                    return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return FarmController;
}(BaseController_1.BaseController));
exports.FarmController = FarmController;
//# sourceMappingURL=FarmController.js.map