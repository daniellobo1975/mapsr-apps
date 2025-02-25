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
exports.Farm = void 0;
var typeorm_1 = require("typeorm");
var BaseAddress_1 = require("./BaseAddress");
var Client_1 = require("./Client");
var FarmReferece_1 = require("./FarmReferece");
var Farm = /** @class */ (function (_super) {
    __extends(Farm, _super);
    function Farm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
        __metadata("design:type", String)
    ], Farm.prototype, "farmName", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
        __metadata("design:type", String)
    ], Farm.prototype, "fCar", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Client_1.Client; }, function (client) { return client.uid; }, { onDelete: 'CASCADE' })
        // `JoinColumn` can be used on both one-to-one and many-to-one relations to specify custom column name
        // or custom referenced column.
        ,
        (0, typeorm_1.JoinColumn)({ referencedColumnName: "uid", name: 'clientId' /*nome a ser exibido no bd*/ }),
        __metadata("design:type", String)
    ], Farm.prototype, "clientId", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return FarmReferece_1.FarmReferece; }, function (farmReference) { return farmReference.farmId; }, {
            // cascade: true,
            // onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            nullable: true,
            // eager: true
        }),
        __metadata("design:type", Array)
    ], Farm.prototype, "farmReferences", void 0);
    Farm = __decorate([
        (0, typeorm_1.Entity)({ name: 'Farm' })
    ], Farm);
    return Farm;
}(BaseAddress_1.BaseAddress));
exports.Farm = Farm;
//# sourceMappingURL=Farm.js.map