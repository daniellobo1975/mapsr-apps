import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: 'UpdateBase' })
export class UpdateBase extends BaseEntity {
    @Column({ type: 'varchar', length: 200, nullable: true })
    ultimaAtualizacaoMaps: string;
}