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
import { spawn } from 'child_process';
import * as path from 'path';
import variables from '../configuration/config';
var fsPromises = require("fs/promises");
var axios = require('axios');
var CarteladaController = /** @class */ (function () {
    function CarteladaController() {
    }
    CarteladaController.prototype.cartelada = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, anos, cars, lsimplesProcess, result;
            var _this = this;
            return __generator(this, function (_b) {
                _a = req.body, anos = _a.anos, cars = _a.cars;
                console.log("anos", JSON.stringify(anos));
                console.log("cars", JSON.stringify(cars));
                lsimplesProcess = spawn('Rscript', [
                    '/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/lsimples.R',
                    'loopJson',
                    JSON.stringify(anos),
                    JSON.stringify(cars)
                ]);
                result = '';
                // Captura a saída padrão do processo R
                lsimplesProcess.stdout.on('data', function (data) {
                    result += data.toString();
                });
                // Captura erros, se houverem
                lsimplesProcess.stderr.on('data', function (data) {
                    console.error("Erro no processo R: ".concat(data));
                });
                // Manipula eventos de conclusão do processo
                lsimplesProcess.on('close', function (code) {
                    if (code === 0) {
                        console.log('Resultado em Node.js:', result.trim());
                        console.log('Processo R concluido com sucesso.');
                        _this.webhook(anos, cars).then();
                    }
                    else {
                        console.error("Processo R encerrou com c\u00F3digo de erro ".concat(code));
                    }
                });
                return [2 /*return*/, { status: 200, message: "Geração em andamento!" }];
            });
        });
    };
    CarteladaController.prototype.cartelada_v02 = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, anos, cars, carsEntrada, carsJson, errors, lsimplesProcess, result_1;
            var _this = this;
            return __generator(this, function (_b) {
                _a = req.body, anos = _a.anos, cars = _a.cars;
                carsEntrada = JSON.stringify(cars);
                console.log("cars2", carsEntrada);
                console.log("anos2", JSON.stringify(anos));
                carsJson = JSON.parse(carsEntrada);
                errors = this.validateStringLength(carsJson);
                console.log("errors", JSON.stringify(errors));
                if (errors.length > 0) {
                    return [2 /*return*/, { status: 400, errors: errors }];
                }
                else {
                    lsimplesProcess = spawn('Rscript', [
                        '/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/lsimples.R',
                        'loopJson',
                        JSON.stringify(anos),
                        JSON.stringify(cars)
                    ]);
                    result_1 = '';
                    // Captura a saída padrão do processo R
                    lsimplesProcess.stdout.on('data', function (data) {
                        result_1 += data.toString();
                    });
                    // Captura erros, se houverem
                    lsimplesProcess.stderr.on('data', function (data) {
                        console.error("Erro no processo R: ".concat(data));
                    });
                    // Manipula eventos de conclusão do processo
                    lsimplesProcess.on('close', function (code) {
                        if (code === 0) {
                            console.log('Resultado em Node.js:', result_1.trim());
                            console.log('Processo R concluido com sucesso.');
                            _this.webhook(anos, cars).then();
                        }
                        else {
                            console.error("Processo R encerrou com c\u00F3digo de erro ".concat(code));
                        }
                    });
                    return [2 /*return*/, { status: 200, message: "Geração em andamento!" }];
                }
                return [2 /*return*/];
            });
        });
    };
    CarteladaController.prototype.validateStringLength = function (strings) {
        var errorList = [];
        console.log('iniciandovalidacao');
        for (var i = 0; i < strings.length; i++) {
            var str = strings[i];
            var hyphenCount = (str.match(/-/g) || []).length;
            console.log('hyphenCount ', hyphenCount);
            if (str.length === 43) {
                if (hyphenCount !== 2) {
                    errorList.push("Car tem 43 caracteres mas não tem 2 hífens: " + str);
                }
                if (str[2] !== '-' || str[10] !== '-') {
                    errorList.push("Car tem 43 caracteres mas não tem hífens nas posições 3 e 11: " + str);
                }
            }
            if (str.length !== 43) {
                errorList.push("Car não tem 43 caracteres: " + str);
            }
            if (str.length > 43) {
                errorList.push("Car tem mais de 43 caracteres: " + str);
            }
        }
        return errorList;
    };
    CarteladaController.prototype.webhook = function (anos, cars) {
        return __awaiter(this, void 0, void 0, function () {
            var baseFolderGeoJson, baseFolderJson, _i, anos_1, ano, _a, cars_1, car, filePath, content, objetoJson, url, payload, response, error_1, _b, anos_2, ano, _c, cars_2, car, filePath, content, objetoJson, config, payload, response, error_2, error_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        baseFolderGeoJson = variables.folderStorageNovoGEOJSON;
                        baseFolderJson = variables.folderStorageNovoJSON;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 20, , 21]);
                        _i = 0, anos_1 = anos;
                        _d.label = 2;
                    case 2:
                        if (!(_i < anos_1.length)) return [3 /*break*/, 10];
                        ano = anos_1[_i];
                        _a = 0, cars_1 = cars;
                        _d.label = 3;
                    case 3:
                        if (!(_a < cars_1.length)) return [3 /*break*/, 9];
                        car = cars_1[_a];
                        filePath = path.join(baseFolderGeoJson, String(ano), "/geoJson/".concat(car, ".GeoJSON"));
                        console.log("filePath", filePath);
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 7, , 8]);
                        return [4 /*yield*/, fsPromises.readFile(filePath, 'utf8')];
                    case 5:
                        content = _d.sent();
                        objetoJson = JSON.parse(content);
                        objetoJson.features.forEach(function (e) {
                            e.geometry = JSON.stringify(e.geometry);
                        });
                        url = 'https://lobo04.bubbleapps.io/api/1.1/wf/post_geojson';
                        payload = {
                            body: objetoJson
                        };
                        return [4 /*yield*/, axios.post(url, payload, {
                                timeout: 180000
                            })];
                    case 6:
                        response = _d.sent();
                        console.log("Resposta do servidor: ".concat(JSON.stringify(response.data)));
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _d.sent();
                        console.error("Erro ao ler o arquivo ".concat(car, ".GeoJSON (").concat(ano, "):"), error_1.message);
                        return [3 /*break*/, 8];
                    case 8:
                        _a++;
                        return [3 /*break*/, 3];
                    case 9:
                        _i++;
                        return [3 /*break*/, 2];
                    case 10:
                        _b = 0, anos_2 = anos;
                        _d.label = 11;
                    case 11:
                        if (!(_b < anos_2.length)) return [3 /*break*/, 19];
                        ano = anos_2[_b];
                        _c = 0, cars_2 = cars;
                        _d.label = 12;
                    case 12:
                        if (!(_c < cars_2.length)) return [3 /*break*/, 18];
                        car = cars_2[_c];
                        filePath = path.join(baseFolderJson, String(ano), "/json/".concat(car, ".json"));
                        console.log("filePath json", filePath);
                        _d.label = 13;
                    case 13:
                        _d.trys.push([13, 16, , 17]);
                        return [4 /*yield*/, fsPromises.readFile(filePath, 'utf8')];
                    case 14:
                        content = _d.sent();
                        objetoJson = JSON.parse(content);
                        config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://lobo04.bubbleapps.io/api/1.1/wf/getjson',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: objetoJson
                        };
                        payload = {
                            body: objetoJson
                        };
                        // Envia a requisição HTTP usando axios
                        console.log("json: ".concat(JSON.stringify(payload)));
                        return [4 /*yield*/, axios.post(config.url, payload, {
                                timeout: 180000
                            })];
                    case 15:
                        response = _d.sent();
                        console.log("Resposta do servidor json: ".concat(JSON.stringify(response.data)));
                        return [3 /*break*/, 17];
                    case 16:
                        error_2 = _d.sent();
                        console.error("Erro ao ler o arquivo ".concat(car, ".json (").concat(ano, "):"), error_2.message);
                        return [3 /*break*/, 17];
                    case 17:
                        _c++;
                        return [3 /*break*/, 12];
                    case 18:
                        _b++;
                        return [3 /*break*/, 11];
                    case 19: return [3 /*break*/, 21];
                    case 20:
                        error_3 = _d.sent();
                        console.error('Erro ao processar os anos e cars:', error_3.message);
                        return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    return CarteladaController;
}());
export { CarteladaController };
