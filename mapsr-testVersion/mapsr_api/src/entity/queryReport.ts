import { Entity, Column, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { statusQueryReport } from "./enum/statusQueryReport";
import { FarmReferece } from "./FarmReferece";

@Entity({ name: 'queryReport' })
export class queryReport extends BaseEntity {
    @Column({ type: "enum", enum: statusQueryReport, nullable: true })
    statusQueryReport: statusQueryReport;

    @Column({ type: 'varchar', length: 2000, nullable: true })
    observation: string;

    @Column({ type: 'varchar', length: 2000, nullable: true })
    numCar: string;

    @OneToOne(() => FarmReferece, (farmRef: FarmReferece) => farmRef.uid, { eager: true })
    @JoinColumn({ referencedColumnName: "uid", name: 'farmRef'/*nome a ser exibido no bd*/ })
    farmRef: string;

    @OneToOne(() => FarmReferece, (farmRef: FarmReferece) => farmRef.uid, { eager: true, nullable: true })
    @JoinColumn({ referencedColumnName: "uid", name: 'farmRef'/*nome a ser exibido no bd*/ })
    farmRefEntity: FarmReferece;

    @Column({ type: 'varchar', length: 200, nullable: true })
    result_csv: string;
    
    @Column({ type: 'varchar', length: 200, nullable: true })
    result_json: string

    @Column({ type: 'varchar', length: 200, nullable: true })
    ano_referencia: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    erro_geracao_arquivo: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    result_mapPdf: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    result_shapefile_shp: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    result_shapefile_prj: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    result_shapefile_dbf: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    result_shapefile_shx: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    result_geojson: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    app_area: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    forest_area_in_app: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    forest_deficit: string;
}