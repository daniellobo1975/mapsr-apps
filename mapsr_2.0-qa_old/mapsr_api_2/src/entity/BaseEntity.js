var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
var BaseEntity = /** @class */ (function () {
    function BaseEntity() {
    }
    __decorate([
        PrimaryGeneratedColumn("uuid")
    ], BaseEntity.prototype, "uid");
    __decorate([
        Column({ "default": true })
    ], BaseEntity.prototype, "active");
    __decorate([
        Column({ "default": false })
    ], BaseEntity.prototype, "deleted");
    __decorate([
        CreateDateColumn({ type: "timestamptz" })
    ], BaseEntity.prototype, "createAt");
    __decorate([
        UpdateDateColumn({ type: "timestamptz" })
    ], BaseEntity.prototype, "upadateAt");
    return BaseEntity;
}());
export { BaseEntity };
