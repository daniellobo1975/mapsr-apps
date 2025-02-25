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
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseAddress } from "./BaseAddress";
import { Client } from "./Client";
import { FarmReferece } from "./FarmReferece";
var Farm = /** @class */ (function (_super) {
    __extends(Farm, _super);
    function Farm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Column({ type: 'varchar', length: 200 })
    ], Farm.prototype, "farmName");
    __decorate([
        Column({ type: 'varchar', length: 200 })
    ], Farm.prototype, "fCar");
    __decorate([
        ManyToOne(function () { return Client; }, function (client) { return client.uid; }, { onDelete: 'CASCADE' })
        // `JoinColumn` can be used on both one-to-one and many-to-one relations to specify custom column name
        // or custom referenced column.
        ,
        JoinColumn({ referencedColumnName: "uid", name: 'clientId' /*nome a ser exibido no bd*/ })
    ], Farm.prototype, "clientId");
    __decorate([
        OneToMany(function () { return FarmReferece; }, function (farmReference) { return farmReference.farmId; }, {
            // cascade: true,
            // onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            nullable: true
        })
    ], Farm.prototype, "farmReferences");
    Farm = __decorate([
        Entity({ name: 'Farm' })
    ], Farm);
    return Farm;
}(BaseAddress));
export { Farm };
