import { getRepository, Repository } from "typeorm";
import { Request } from "express";
import { UpdateBase } from "../entity/UpdateEntity";

export class UpdateController {
    private _repositoryUpdate: Repository<UpdateBase>;

    constructor() {
        this._repositoryUpdate = getRepository<UpdateBase>(UpdateBase);
    }

    async updatemaps(request: Request) {
        await this._repositoryUpdate.save({
            ultimaAtualizacaoMaps: this.formatDateToString(new Date())
        })

        return { status: 200, errors: [] }
    }

    async getlastupdate(request: Request) {
        let lista = await this._repositoryUpdate.find();

        console.log('lista', lista)
        console.log('date1', new Date(lista[0].ultimaAtualizacaoMaps))
        console.log('date2', new Date(lista[0].ultimaAtualizacaoMaps).getTime())
        lista.sort((a, b) => new Date(b.ultimaAtualizacaoMaps).getTime() - new Date(a.ultimaAtualizacaoMaps).getTime());

        const maisRecente = lista[0];

        return { status: 200, errors: maisRecente }
    }

    private formatDateToString(date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
}