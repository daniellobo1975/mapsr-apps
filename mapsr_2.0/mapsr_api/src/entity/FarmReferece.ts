import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Farm } from "./Farm";
import { User } from "./User";

@Entity({ name: 'FarmReferece' })
export class FarmReferece extends BaseEntity {
    @Column({ type: 'varchar', length: 200, nullable: true })
    referenceName: string;
    
    @ManyToOne(() => Farm, (farm: Farm) => farm.uid, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ referencedColumnName: "uid", name: 'farmId'/*nome a ser exibido no bd*/ })
    farmId: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    car_shp: string;
    @Column({ type: 'varchar', length: 200, nullable: true })
    car_shx: string;
    @Column({ type: 'varchar', length: 200, nullable: true })
    car_prj: string;
    @Column({ type: 'varchar', length: 200, nullable: true })
    car_dbf: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    app_shp: string;
    @Column({ type: 'varchar', length: 200, nullable: true })
    app_shx: string;
    @Column({ type: 'varchar', length: 200, nullable: true })
    app_prj: string;
    @Column({ type: 'varchar', length: 200, nullable: true })
    app_dbf: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    biomas: string;

    @ManyToOne(() => User, (user: User) => user.uid, { onDelete: 'CASCADE' })
    @JoinColumn({ referencedColumnName: "uid", name: 'requestingUser'/*nome a ser exibido no bd*/ })
    requestingUser: string;

    // new columns 2.0
    @Column({ type: 'varchar', length: 200, nullable: true })
    longitude: string;
    @Column({ type: 'varchar', length: 200, nullable: true })
    latitude: string;
    @Column({ type: 'varchar', length: 200, nullable: true })
    ano_referencia: string;
    @Column({ type: 'varchar', length: 200, nullable: true })
    fcar: string;
    @Column({ type: 'varchar', length: 200, nullable: true })
    numCar: string;
}
