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
import { Entity, Column, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { statusQueryReport } from "./enum/statusQueryReport";
import { FarmReferece } from "./FarmReferece";
var queryReport = /** @class */ (function (_super) {
    __extends(queryReport, _super);
    function queryReport() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Column({ type: "enum", "enum": statusQueryReport, nullable: true })
    ], queryReport.prototype, "statusQueryReport");
    __decorate([
        Column({ type: 'varchar', length: 2000, nullable: true })
    ], queryReport.prototype, "observation");
    __decorate([
        Column({ type: 'varchar', length: 2000, nullable: true })
    ], queryReport.prototype, "numCar");
    __decorate([
        OneToOne(function () { return FarmReferece; }, function (farmRef) { return farmRef.uid; }, { eager: true }),
        JoinColumn({ referencedColumnName: "uid", name: 'farmRef' /*nome a ser exibido no bd*/ })
    ], queryReport.prototype, "farmRef");
    __decorate([
        OneToOne(function () { return FarmReferece; }, function (farmRef) { return farmRef.uid; }, { eager: true, nullable: true }),
        JoinColumn({ referencedColumnName: "uid", name: 'farmRef' /*nome a ser exibido no bd*/ })
    ], queryReport.prototype, "farmRefEntity");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "result_csv");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "result_json");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "ano_referencia");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "erro_geracao_arquivo");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "result_mapPdf");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "result_shapefile_shp");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "result_shapefile_prj");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "result_shapefile_dbf");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "result_shapefile_shx");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "result_geojson");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "app_area");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "forest_area_in_app");
    __decorate([
        Column({ type: 'varchar', length: 200, nullable: true })
    ], queryReport.prototype, "forest_deficit");
    queryReport = __decorate([
        Entity({ name: 'queryReport' })
    ], queryReport);
    return queryReport;
}(BaseEntity));
export { queryReport };
