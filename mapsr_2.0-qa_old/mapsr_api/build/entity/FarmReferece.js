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
exports.FarmReferece = void 0;
var typeorm_1 = require("typeorm");
var BaseEntity_1 = require("./BaseEntity");
var Farm_1 = require("./Farm");
var User_1 = require("./User");
var FarmReferece = /** @class */ (function (_super) {
    __extends(FarmReferece, _super);
    function FarmReferece() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "referenceName", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Farm_1.Farm; }, function (farm) { return farm.uid; }, { onDelete: 'CASCADE', eager: true }),
        (0, typeorm_1.JoinColumn)({ referencedColumnName: "uid", name: 'farmId' /*nome a ser exibido no bd*/ }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "farmId", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "car_shp", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "car_shx", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "car_prj", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "car_dbf", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "app_shp", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "app_shx", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "app_prj", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "app_dbf", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "biomas", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_1.User; }, function (user) { return user.uid; }, { onDelete: 'CASCADE' }),
        (0, typeorm_1.JoinColumn)({ referencedColumnName: "uid", name: 'requestingUser' /*nome a ser exibido no bd*/ }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "requestingUser", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "longitude", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "latitude", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "ano_referencia", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "fcar", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], FarmReferece.prototype, "numCar", void 0);
    FarmReferece = __decorate([
        (0, typeorm_1.Entity)({ name: 'FarmReferece' })
    ], FarmReferece);
    return FarmReferece;
}(BaseEntity_1.BaseEntity));
exports.FarmReferece = FarmReferece;
//# sourceMappingURL=FarmReferece.js.map