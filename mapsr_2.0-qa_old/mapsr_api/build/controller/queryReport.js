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
exports.queryReport = void 0;
var typeorm_1 = require("typeorm");
var BaseEntity_1 = require("./BaseEntity");
var statusQueryReport_1 = require("./enum/statusQueryReport");
var FarmReferece_1 = require("./FarmReferece");
var queryReport = /** @class */ (function (_super) {
    __extends(queryReport, _super);
    function queryReport() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    var _a;
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: statusQueryReport_1.statusQueryReport, nullable: true }),
        __metadata("design:type", typeof (_a = typeof statusQueryReport_1.statusQueryReport !== "undefined" && statusQueryReport_1.statusQueryReport) === "function" ? _a : Object)
    ], queryReport.prototype, "statusQueryReport", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 2000, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "observation", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 2000, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "numCar", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return FarmReferece_1.FarmReferece; }, function (farmRef) { return farmRef.uid; }, { eager: true }),
        (0, typeorm_1.JoinColumn)({ referencedColumnName: "uid", name: 'farmRef' /*nome a ser exibido no bd*/ }),
        __metadata("design:type", String)
    ], queryReport.prototype, "farmRef", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "result_csv", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "result_mapPdf", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "result_shapefile_shp", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "result_shapefile_prj", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "result_shapefile_dbf", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "result_shapefile_shx", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "result_geojson", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "app_area", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "forest_area_in_app", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
        __metadata("design:type", String)
    ], queryReport.prototype, "forest_deficit", void 0);
    queryReport = __decorate([
        (0, typeorm_1.Entity)({ name: 'queryReport' })
    ], queryReport);
    return queryReport;
}(BaseEntity_1.BaseEntity));
exports.queryReport = queryReport;
//# sourceMappingURL=queryReport.js.map