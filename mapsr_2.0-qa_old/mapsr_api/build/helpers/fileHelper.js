"use strict";
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
exports.FileHelper = void 0;
var fs = require("fs");
var jimp = require("jimp");
var config_1 = require("../configuration/config");
var utilHeper_1 = require("./utilHeper");
var FileHelper = /** @class */ (function () {
    function FileHelper() {
    }
    FileHelper.fileBase64 = function (base64Data, fileType, fileDefaltName) {
        return __awaiter(this, void 0, void 0, function () {
            var fileBuffer, _directory, dirExistis, filename, fileNamePath, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        fileBuffer = Buffer.from(base64Data, 'base64');
                        _directory = config_1.default.folderStorage;
                        return [4 /*yield*/, fs.existsSync(_directory)];
                    case 1:
                        dirExistis = _a.sent();
                        if (!!dirExistis) return [3 /*break*/, 3];
                        return [4 /*yield*/, fs.mkdirSync(_directory)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        filename = '';
                        if (fileDefaltName === '' || !fileDefaltName) {
                            filename = "".concat(utilHeper_1.UtilsHelper.GenerateUniqueHash, ".").concat(fileType);
                        }
                        else {
                            filename = "".concat(fileDefaltName, ".").concat(fileType);
                        }
                        fileNamePath = "".concat(_directory, "/").concat(filename);
                        return [4 /*yield*/, fs.writeFileSync(fileNamePath, fileBuffer, 'base64')];
                    case 4:
                        _a.sent();
                        console.log('File Saved in', fileNamePath);
                        if (fs.existsSync(fileNamePath)) {
                            return [2 /*return*/, filename];
                        }
                        else {
                            return [2 /*return*/, ''];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        return [2 /*return*/, ''];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FileHelper.writePicture = function (base64Data) {
        return __awaiter(this, void 0, void 0, function () {
            var positionEndStringIdentifyBase64, _base64Data, _directory, dirExistis, filename, fileNamePath, jimpResult, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (base64Data.indexOf('base64') == -1)
                            return [2 /*return*/, base64Data
                                //Add 7 caracteres for discont to word base64 and ,
                            ];
                        positionEndStringIdentifyBase64 = (base64Data.indexOf('base64') + 7);
                        _base64Data = base64Data.substring(positionEndStringIdentifyBase64);
                        _directory = config_1.default.folderStorage;
                        return [4 /*yield*/, fs.existsSync(_directory)];
                    case 1:
                        dirExistis = _a.sent();
                        if (!!dirExistis) return [3 /*break*/, 3];
                        return [4 /*yield*/, fs.mkdirSync(_directory)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        filename = "".concat(utilHeper_1.UtilsHelper.GenerateUniqueHash, ".jpg");
                        fileNamePath = "".concat(_directory, "/").concat(filename);
                        return [4 /*yield*/, fs.writeFileSync(fileNamePath, _base64Data, 'base64')];
                    case 4:
                        _a.sent();
                        console.log('File Saved in', fileNamePath);
                        return [4 /*yield*/, jimp.read(fileNamePath)];
                    case 5:
                        jimpResult = _a.sent();
                        jimpResult.quality(parseInt(config_1.default.pictureQuality.toString())).write(fileNamePath);
                        return [2 /*return*/, filename];
                    case 6:
                        error_2 = _a.sent();
                        console.log('Error save file, description: ', error_2);
                        return [2 /*return*/, ''];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    FileHelper.validFolderExistAsync = function (ano, path, nameFile) {
        return __awaiter(this, void 0, void 0, function () {
            var isFolderExist;
            return __generator(this, function (_a) {
                isFolderExist = fs.existsSync("/mnt/volume_mapsr_11may22/fazendas/v08/" + ano + "/" + path + "/" + nameFile);
                return [2 /*return*/, isFolderExist];
            });
        });
    };
    return FileHelper;
}());
exports.FileHelper = FileHelper;
//# sourceMappingURL=fileHelper.js.map