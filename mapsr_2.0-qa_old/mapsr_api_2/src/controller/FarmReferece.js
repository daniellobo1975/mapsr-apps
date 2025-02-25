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
import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Farm } from "./Farm";
import { User } from "./User";
var FarmReferece = /** @class */ (function (_super) {
    __extends(FarmReferece, _super);
    function FarmReferece() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "referenceName");
    __decorate([
        ManyToOne(function () { return Farm; }, function (farm) { return farm.uid; }, { onDelete: 'CASCADE', eager: true }),
        JoinColumn({ referencedColumnName: "uid", name: 'farmId' /*nome a ser exibido no bd*/ })
    ], FarmReferece.prototype, "farmId");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "car_shp");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "car_shx");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "car_prj");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "car_dbf");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "app_shp");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "app_shx");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "app_prj");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "app_dbf");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "biomas");
    __decorate([
        ManyToOne(function () { return User; }, function (user) { return user.uid; }, { onDelete: 'CASCADE' }),
        JoinColumn({ referencedColumnName: "uid", name: 'requestingUser' /*nome a ser exibido no bd*/ })
    ], FarmReferece.prototype, "requestingUser");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "longitude");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "latitude");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "ano_referencia");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], FarmReferece.prototype, "fcar");
    FarmReferece = __decorate([
        Entity({ name: 'FarmReferece' })
    ], FarmReferece);
    return FarmReferece;
}(BaseEntity));
export { FarmReferece };
