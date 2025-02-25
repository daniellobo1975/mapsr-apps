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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var typeorm_1 = require("typeorm");
var BaseAddress_1 = require("./BaseAddress");
var Farm_1 = require("./Farm");
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
        __metadata("design:type", String)
    ], Client.prototype, "clientName", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], Client.prototype, "photo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
        __metadata("design:type", String)
    ], Client.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], Client.prototype, "phone", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Farm_1.Farm; }, function (farm) { return farm.clientId; }, {
            // cascade: true,
            // onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            nullable: true,
            eager: true
        }),
        __metadata("design:type", Array)
    ], Client.prototype, "clientFarms", void 0);
    Client = __decorate([
        (0, typeorm_1.Entity)({ name: 'Client' })
    ], Client);
    return Client;
}(BaseAddress_1.BaseAddress));
exports.Client = Client;
//# sourceMappingURL=Client.js.map