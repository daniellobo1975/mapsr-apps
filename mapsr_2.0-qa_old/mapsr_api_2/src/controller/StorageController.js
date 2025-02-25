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
import variables from '../configuration/config';
import * as path from 'path';
var fsPromises = require("fs/promises");
var fs = require('fs');
var StorageController = /** @class */ (function () {
    function StorageController() {
    }
    StorageController.prototype.getFile = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath;
            return __generator(this, function (_a) {
                filePath = "".concat(variables.folderStorage, "/").concat(req.params.filename);
                return [2 /*return*/, { file: path.resolve(filePath) }];
            });
        });
    };
    StorageController.prototype.getOutputFile = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath;
            return __generator(this, function (_a) {
                filePath = "".concat(variables.folderStorage, "/output/").concat(req.params.filename);
                return [2 /*return*/, { file: path.resolve(filePath) }];
            });
        });
    };
    StorageController.prototype.lerArquivo = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var data, objetoJson, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 1:
                        data = _a.sent();
                        objetoJson = JSON.parse(data);
                        objetoJson.features.forEach(function (e) {
                            e.geometry = JSON.stringify(e.geometry);
                        });
                        console.log('leu tudo');
                        return [2 /*return*/, objetoJson];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Erro ao ler o arquivo:', err_1);
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StorageController.prototype.getOutputReportFile = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var typeArchive, yearFolder, filePath, data, objetoJson, filePath, filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        typeArchive = req.params.filename.split('.');
                        yearFolder = req.params.year;
                        if (!typeArchive[1].toString().toLowerCase().includes('geojson')) return [3 /*break*/, 2];
                        filePath = "".concat(variables.folderStorageNovoGEOJSON, "/").concat(yearFolder, "/geoJson/").concat(req.params.filename);
                        return [4 /*yield*/, fsPromises.readFile(filePath, 'utf8')];
                    case 1:
                        data = _a.sent();
                        objetoJson = JSON.parse(data);
                        objetoJson.features.forEach(function (e) {
                            e.geometry = JSON.stringify(e.geometry);
                        });
                        console.log('leu tudo2', data);
                        return [2 /*return*/, objetoJson];
                    case 2:
                        if (typeArchive[1].toString().toLowerCase().includes('csv')) {
                            filePath = "".concat(variables.folderStorageNovoCSV, "/").concat(yearFolder, "/csv/").concat(req.params.filename);
                            return [2 /*return*/, { file: path.resolve(filePath) }];
                        }
                        else if (typeArchive[1].toString().toLowerCase().includes('json')) {
                            filePath = "".concat(variables.folderStorageNovoJSON, "/").concat(yearFolder, "/json/").concat(req.params.filename);
                            return [2 /*return*/, { file: path.resolve(filePath) }];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StorageController.prototype.deleteFile = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = "".concat(variables.folderStorage, "/").concat(req.params.filename);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fsPromises.unlink(filePath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { status: 200, errors: ['Arquivo removido com sucesso'] }];
                    case 3:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [2 /*return*/, { status: 404, errors: ['Arquivo não encontrado'] }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return StorageController;
}());
export { StorageController };
