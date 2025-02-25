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
exports.farmDefaultReference = void 0;
var typeorm_1 = require("typeorm");
var BaseEntity_1 = require("./BaseEntity");
var Farm_1 = require("./Farm");
var FarmReferece_1 = require("./FarmReferece");
var farmDefaultReference = /** @class */ (function (_super) {
    __extends(farmDefaultReference, _super);
    function farmDefaultReference() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return Farm_1.Farm; }, function (farm) { return farm.uid; }, { eager: false })
        // `JoinColumn` can be used on both one-to-one and many-to-one relations to specify custom column name
        // or custom referenced column.
        ,
        (0, typeorm_1.JoinColumn)({ referencedColumnName: "uid", name: 'farmId' /*nome a ser exibido no bd*/ }),
        __metadata("design:type", String)
    ], farmDefaultReference.prototype, "farmId", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return FarmReferece_1.FarmReferece; }, function (farmRef) { return farmRef.uid; }, { eager: true })
        // `JoinColumn` can be used on both one-to-one and many-to-one relations to specify custom column name
        // or custom referenced column.
        ,
        (0, typeorm_1.JoinColumn)({ referencedColumnName: "uid", name: 'defaultReference' /*nome a ser exibido no bd*/ }),
        __metadata("design:type", String)
    ], farmDefaultReference.prototype, "defaultReference", void 0);
    farmDefaultReference = __decorate([
        (0, typeorm_1.Entity)({ name: 'farmDefaultReference' })
    ], farmDefaultReference);
    return farmDefaultReference;
}(BaseEntity_1.BaseEntity));
exports.farmDefaultReference = farmDefaultReference;
//# sourceMappingURL=farmDefaultReference.js.map