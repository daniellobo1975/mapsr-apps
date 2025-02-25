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
import { getRepository } from 'typeorm';
import { BaseNotification } from '../entity/BaseNotification';
var BaseController = /** @class */ (function (_super) {
    __extends(BaseController, _super);
    function BaseController(entity, onlyRoot) {
        if (onlyRoot === void 0) { onlyRoot = false; }
        var _this = _super.call(this) || this;
        _this._onlyRootController = false;
        _this.errorRoot = {
            status: 401,
            errors: ['Você não está autorizado a executar essa funcionalidade']
        };
        _this._repository = getRepository(entity);
        _this._onlyRootController = onlyRoot;
        return _this;
    }
    BaseController.prototype.checkNotPermission = function (request) {
        return (this._onlyRootController && !request.IsRoot);
    };
    BaseController.prototype.all = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.checkNotPermission(request))
                            return [2 /*return*/, this.errorRoot];
                        return [4 /*yield*/, this._repository.find({
                                where: {
                                    deleted: false
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BaseController.prototype.one = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var uid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.checkNotPermission(request))
                            return [2 /*return*/, this.errorRoot];
                        uid = request.params.id;
                        return [4 /*yield*/, this._repository.findOne(uid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BaseController.prototype.save = function (model, request, ignorePermissions) {
        if (ignorePermissions === void 0) { ignorePermissions = false; }
        return __awaiter(this, void 0, void 0, function () {
            var uid, _modelInDB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ignorePermissions)
                            if (this.checkNotPermission(request))
                                return [2 /*return*/, this.errorRoot];
                        if (!model.uid) return [3 /*break*/, 2];
                        delete model['createAt'];
                        delete model['upadateAt'];
                        delete model['deleted'];
                        uid = model.uid;
                        return [4 /*yield*/, this._repository.findOne(uid)];
                    case 1:
                        _modelInDB = _a.sent();
                        if (_modelInDB) {
                            Object.assign(_modelInDB, model);
                        }
                        _a.label = 2;
                    case 2:
                        if (!this.valid()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._repository.save(model)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/, {
                            status: 400,
                            errors: this.allNotifications
                        }];
                }
            });
        });
    };
    BaseController.prototype.remove = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var uid, model, res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.checkNotPermission(request))
                            return [2 /*return*/, this.errorRoot];
                        uid = request.params.id;
                        return [4 /*yield*/, this._repository.findOne(uid)];
                    case 1:
                        model = _a.sent();
                        if (!model) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        model.deleted = true;
                        return [4 /*yield*/, this._repository.save(model)];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 4:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, {
                            status: 404,
                            errors: [
                                'Item não encontrado no banco de dados'
                            ]
                        }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(BaseController.prototype, "repostitory", {
        get: function () {
            return this._repository;
        },
        enumerable: false,
        configurable: true
    });
    return BaseController;
}(BaseNotification));
export { BaseController };
