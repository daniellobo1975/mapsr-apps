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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.UserController = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("../entity/User");
var BaseController_1 = require("./BaseController");
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../configuration/config");
var md5 = require("md5");
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var path = require('path');
var hbs = require('nodemailer-express-handlebars');
var jsonwebtoken_2 = require("jsonwebtoken");
var UserController = /** @class */ (function (_super) {
    __extends(UserController, _super);
    function UserController() {
        var _this = _super.call(this, User_1.User) || this;
        _this._repository2 = (0, typeorm_1.getRepository)(User_1.User);
        return _this;
    }
    // async base64(request: Request) {
    //     // async base64(base64Data: string,fileType:string) {
    //     let { base64Data, fileType, fileDefaltName } = request.body;
    //     try {
    //         let res = await FileHelper.fileBase64(base64Data, fileType, fileDefaltName);
    //         console.log(res.substring(0, res.length-4))
    //         return res;
    //     } catch (error) {
    //         console.log('erro base64', error)
    //     }
    // }
    UserController.prototype.all = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var token, _userAuth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = request.body.token || request.query.token || request.headers['x-token-access'];
                        return [4 /*yield*/, this._validateToken(token)];
                    case 1:
                        _userAuth = _a.sent();
                        if (!_userAuth.isRoot || _userAuth.isRoot === false)
                            return [2 /*return*/, { status: 400, errors: ['Para acessar tal recurso você deve ser administrador'] }];
                        return [4 /*yield*/, this._repository2.find({
                                where: {
                                    deleted: false
                                }
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.auth = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, user, _payload;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, email = _a.email, password = _a.password;
                        if (!email || !password)
                            return [2 /*return*/, { status: 400, message: 'Informe o email e a senha para efetuar o login' }];
                        return [4 /*yield*/, this.repostitory.findOne({ email: email, password: md5(password) })];
                    case 1:
                        user = _b.sent();
                        if (user) {
                            _payload = {
                                attendantName: user.attendantName,
                                email: user.email,
                                isRoot: user.isRoot
                            };
                            return [2 /*return*/, {
                                    status: 200,
                                    message: {
                                        user: _payload,
                                        token: (0, jsonwebtoken_1.sign)(__assign(__assign({}, _payload), { tm: new Date().getTime() }), config_1.default.secretyKey)
                                    }
                                }];
                        }
                        else
                            return [2 /*return*/, { status: 404, message: 'E-mail ou senha inválidos' }];
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.createUser = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, photo, attendantName, email, password, confirmPassword, validation1, _user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, photo = _a.photo, attendantName = _a.attendantName, email = _a.email, password = _a.password, confirmPassword = _a.confirmPassword;
                        _super.prototype.isRequired.call(this, email, 'Informe o e-mail');
                        _super.prototype.isRequired.call(this, password, 'Informe a senha');
                        _super.prototype.isRequired.call(this, confirmPassword, 'Informe a confirmação da senha');
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(User_1.User).findOne({ email: email })];
                    case 1:
                        validation1 = _b.sent();
                        if (!validation1) return [3 /*break*/, 2];
                        return [2 /*return*/, { status: 400, message: 'Inválido: Email já está cadastrado.' }];
                    case 2: return [4 /*yield*/, this.validateEmail(email)];
                    case 3:
                        if ((_b.sent()) == false) {
                            return [2 /*return*/, { status: 400, message: 'Email invalido' }];
                        }
                        _b.label = 4;
                    case 4:
                        _user = new User_1.User();
                        _user.photo = photo;
                        _user.email = email;
                        _user.attendantName = attendantName;
                        if (password != confirmPassword)
                            return [2 /*return*/, { status: 400, errors: ['A senha e a confirmação são diferente'] }];
                        if (password)
                            _user.password = md5(password);
                        //nao permite criar usuário root diretamente
                        //por questoes de segurança
                        _user.isRoot = false;
                        return [2 /*return*/, _super.prototype.save.call(this, _user, request)];
                }
            });
        });
    };
    // async save(request: Request) {
    //     let _user = <User>request.body;
    //     return super.save(_user, request);
    // }
    //Mudar email usuario logado
    UserController.prototype.changeEmail = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, newEmail, newEmailConfirm, password, token, _userAuth, email, _user, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, newEmail = _a.newEmail, newEmailConfirm = _a.newEmailConfirm, password = _a.password;
                        if (newEmail != newEmailConfirm) {
                            newEmail = null;
                            _super.prototype.isRequired.call(this, newEmail, 'Novo email não confere com confirmação email!');
                        }
                        token = request.body.token || request.query.token || request.headers['x-token-access'];
                        if (token) { //se existe
                            try {
                                _userAuth = (0, jsonwebtoken_2.verify)(token, config_1.default.secretyKey);
                            }
                            catch (error) {
                                return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                            }
                        }
                        else { //se nao enviado token login, recusa acesso
                            return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                        }
                        email = _userAuth.email;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.repostitory.findOne({ email: email, password: md5(password) })];
                    case 2:
                        _user = _b.sent();
                        if (_user) {
                            _user.email = newEmail;
                            return [2 /*return*/, _super.prototype.save.call(this, _user, request)];
                        }
                        else {
                            return [2 /*return*/, { status: 400, errors: ['Usuário nao encontrado'] }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //Mudar senha usuario logado
    UserController.prototype.changePassword = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, passwordActual, passwordNew, passwordNewConfirm, token, _userAuth, email, _user, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, passwordActual = _a.passwordActual, passwordNew = _a.passwordNew, passwordNewConfirm = _a.passwordNewConfirm;
                        if (passwordNew != passwordNewConfirm) {
                            return [2 /*return*/, { status: 400, message: 'Nova senha não confere com confirmação!' }];
                        }
                        token = request.body.token || request.query.token || request.headers['x-token-access'];
                        if (token) { //se existe
                            try {
                                _userAuth = (0, jsonwebtoken_2.verify)(token, config_1.default.secretyKey);
                            }
                            catch (error) {
                                return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                            }
                        }
                        else { //se nao enviado token login, recusa acesso
                            return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                        }
                        email = _userAuth.email;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.repostitory.findOne({ email: email, password: md5(passwordActual) })];
                    case 2:
                        _user = _b.sent();
                        if (_user) {
                            if (_user.password === md5(passwordActual)) {
                                _user.password = md5(passwordNew);
                                ;
                                return [2 /*return*/, _super.prototype.save.call(this, _user, request)];
                            }
                            else {
                                return [2 /*return*/, { status: 400, errors: ['Senha atual incorreta!'] }];
                            }
                        }
                        else {
                            return [2 /*return*/, { status: 400, errors: ['Usuário nao encontrado'] }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        console.log(error_2);
                        return [2 /*return*/, { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.recoverMail = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var email, _user, token, expireToken, transport, link, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = request.body.email;
                        _super.prototype.isRequired.call(this, email, 'Informe o e-mail');
                        return [4 /*yield*/, this.repostitory.findOne({ email: email })];
                    case 1:
                        _user = _a.sent();
                        if (!_user)
                            return [2 /*return*/, { status: 404, message: 'Email não encontrado.' }];
                        token = crypto.randomBytes(20).toString('hex');
                        expireToken = new Date(Date.now());
                        expireToken.setHours(expireToken.getHours() + 1);
                        _user.passwordResetToken = token;
                        _user.passwordResetExpires = expireToken;
                        // salvar junto model
                        // passwordResetToken  ---- ocultar da requisição
                        // passwordResetExpires  ( data, defalt: Date.now, )---- ocultar da requisição
                        return [4 /*yield*/, _super.prototype.save.call(this, _user, request)];
                    case 2:
                        // salvar junto model
                        // passwordResetToken  ---- ocultar da requisição
                        // passwordResetExpires  ( data, defalt: Date.now, )---- ocultar da requisição
                        _a.sent();
                        transport = nodemailer.createTransport({
                            host: config_1.default.mailCredencials.host,
                            port: config_1.default.mailCredencials.port,
                            auth: {
                                user: config_1.default.mailCredencials.user,
                                pass: config_1.default.mailCredencials.pass
                            }
                        });
                        transport.use('compile', hbs({
                            viewEngine: {
                                defaultLayout: undefined,
                                partialsDir: path.resolve('./src/resources/mail/')
                            },
                            viewPath: path.resolve('./src/resources/mail/'),
                            extName: '.html',
                        }));
                        link = config_1.default.mailCredencials.siteUrl;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                transport.sendMail({
                                    from: config_1.default.mailCredencials.mailName,
                                    to: email,
                                    subject: config_1.default.mailCredencials.subject,
                                    template: 'auth/forgot_password',
                                    context: { token: token, link: link },
                                    // text: 'I hope this message gets delivered!'
                                }, function (err, info) {
                                    if (info) {
                                        resolve(true);
                                    }
                                    if (err) {
                                        resolve(false);
                                    }
                                });
                            })];
                }
            });
        });
    };
    //para após recebido o token efetivar a mudança
    UserController.prototype.resetPassword = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, passwordNew, passwordNewConfirm, passwordResetToken, _user, expireToken, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, passwordNew = _a.passwordNew, passwordNewConfirm = _a.passwordNewConfirm, passwordResetToken = _a.passwordResetToken;
                        return [4 /*yield*/, this.repostitory.findOne({ passwordResetToken: passwordResetToken })];
                    case 1:
                        _user = _b.sent();
                        if (!passwordResetToken)
                            return [2 /*return*/, { status: 404, message: 'Token é obrigatório.' }];
                        if (!_user)
                            return [2 /*return*/, { status: 404, message: 'Usuário não encontrado.' }];
                        expireToken = new Date(Date.now());
                        expireToken.setHours(expireToken.getHours());
                        if (expireToken > _user.passwordResetExpires) {
                            return [2 /*return*/, { status: 400, errors: ['Token expirado'] }];
                        }
                        if (passwordNew != passwordNewConfirm)
                            return [2 /*return*/, { status: 404, message: 'Nova senha não confere com confirmação!' }];
                        if (passwordNew) {
                            _user.password = md5(passwordNew);
                            _user.passwordResetExpires = expireToken;
                        }
                        else {
                            return [2 /*return*/, { status: 404, message: 'Nova senha é obrigatória' }];
                        }
                        return [4 /*yield*/, _super.prototype.save.call(this, _user, request)];
                    case 2:
                        res = _b.sent();
                        if (res)
                            return [2 /*return*/, _user];
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.validateEmail = function (value) {
        var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
        if (!reg.test(value))
            return false;
        else
            return true;
    };
    UserController.prototype._validateToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var _userToken, _user, error_3, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!token) return [3 /*break*/, 8];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        _userToken = (0, jsonwebtoken_2.verify)(token, config_1.default.secretyKey);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._repository2.findOne({ email: _userToken.email })];
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
    return UserController;
}(BaseController_1.BaseController));
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map