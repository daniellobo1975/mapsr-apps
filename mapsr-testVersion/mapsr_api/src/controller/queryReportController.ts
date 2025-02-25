import { getRepository, Repository } from "typeorm";
import { Request } from "express";
import { BaseController } from "./BaseController";
import { verify } from 'jsonwebtoken';
import { FarmReferece } from "../entity/FarmReferece";
import { User } from "../entity/User";
import { queryReport } from "../entity/queryReport";
import { statusQueryReport } from "../entity/enum/statusQueryReport";
import config from '../configuration/config';

const fs = require('fs')
const R = require('r-integration');

export class queryReportController extends BaseController<FarmReferece>{
  private _repository_FarmReferece: Repository<FarmReferece>;
  private _repository_QueryReport: Repository<queryReport>;
  private _repository_User: Repository<User>;

  constructor() {
    super(FarmReferece, false);

    this._repository_FarmReferece = getRepository<FarmReferece>(FarmReferece);
    this._repository_QueryReport = getRepository<queryReport>(queryReport);
    this._repository_User = getRepository<User>(User);
  }

  async createQueryReportBuscar(request: Request) {
    const _farmReference = await this._repository_FarmReferece.findOne({
      where: {
        uid: request.params.id,
      }
    });

    if (!_farmReference)
      return { status: 400, errors: ['Referência não encontrada'] }

    let qResult: queryReport = new queryReport();
    let resultScript

    try {

      resultScript = await this.executeRScriptBuscar(_farmReference.longitude, _farmReference.latitude, _farmReference.ano_referencia);

      console.log('result script', resultScript)
      console.log('result script [0]', resultScript[0])

      if (resultScript) {
        const _queryReportExecuted = await this._repository_QueryReport.findOne({
          where: {
            numCar: resultScript[0],
          },
          relations: ['farmRef']
        });

        console.log('result _queryReportExecuted', _queryReportExecuted)
        console.log('result queryReportExecuted.ano_referencia', _queryReportExecuted.ano_referencia)
        console.log('result _farmReference.ano_referencia', _farmReference.ano_referencia)

        if (_queryReportExecuted != undefined && _queryReportExecuted.ano_referencia == _farmReference.ano_referencia) {
          return { status: 200, errors: ['Já existe pasta para este car e este ano', _queryReportExecuted] }
        }

        qResult.farmRef = _farmReference.uid;
        qResult.ano_referencia = _farmReference.ano_referencia;
        qResult.statusQueryReport = statusQueryReport.concluida;
        qResult.numCar = resultScript[0];

        console.log('result script before save', qResult)

        await this._repository_QueryReport.save(qResult)

        return qResult;
      }
    } catch (error) {
      console.error("Erro ao Salvar ao salvar o buscar", error);
      return { status: 404, errors: ['Erro no processamento dos arquivos', error] }
    }

    return { status: 200, message: "Geração em andamento!" }
  }

  async createQueryReportCar(request: Request) {
    console.log('request.params.numCar', request.params.numCar)
    console.log('request.params.anoRef', request.params.anoRef)
    const _farmReference = await this._repository_FarmReferece.findOne({
      where: {
        numCar: request.params.numCar,
        ano_referencia: request.params.anoRef
      }
    });

    if (!_farmReference)
      return { status: 400, errors: { message: 'Referência não encontrada' } }

    this.executeQueryReport(request);

    return { status: 200, errors: { message: "Geração em andamento!" } }
  }

  async createQueryReport(request: Request) {
    const _farmReference = await this._repository_FarmReferece.findOne({
      where: {
        numCar: request.params.numCar,
        ano_referencia: request.params.anoRef
      }
    });

    if (!_farmReference)
      return { status: 400, errors: { message: 'Referência não encontrada' } }

    this.executeQueryReport(request);

    return { status: 200, errors: "Geração em andamento!" }
  }

  async executeQueryReport(request: Request) {
    let qResult: queryReport = new queryReport();

    const _farmReference = await this._repository_FarmReferece.findOne({
      where: {
        numCar: request.params.numCar,
        ano_referencia: request.params.anoRef
      }
    });

    if (!_farmReference)
      return { status: 400, errors: ['Referência não encontrada'] }

    let queryExecuted = await this._repository_QueryReport.findOne({
      where: {
        numCar: request.params.numCar,
        ano_referencia: request.params.anoRef
      }
    })

    console.log("query report queryExecuted", queryExecuted)

    let resultScript

    try {
      resultScript = await this.executeRScript(_farmReference.uid, queryExecuted.numCar, _farmReference.ano_referencia)
      console.log("resultScript execucao arquivo", resultScript)
      if (resultScript && resultScript[5] != 'error') {

        try {
          this.executeRScriptDinamizado(_farmReference.uid, queryExecuted.numCar, _farmReference.ano_referencia);
        } catch (error) {
          console.log("resultScript executeRScriptDinamizado error", error)
        }

        qResult.farmRef = _farmReference.uid;
        qResult.result_geojson = `${queryExecuted.numCar}.GeoJSON`;
        qResult.result_csv = `${queryExecuted.numCar}.csv`;
        qResult.result_json = `${queryExecuted.numCar}.json`;
        qResult.statusQueryReport = statusQueryReport.concluida;
        qResult.numCar = queryExecuted.numCar;

        let ifInDB = await this._repository_QueryReport.findOne({
          where: {
            farmRef: _farmReference.uid
          }
        })

        if (ifInDB) {
          qResult.uid = ifInDB.uid

          await this._repository_QueryReport.save(qResult)
        }

        return qResult;
      }
      else {
        qResult.farmRef = _farmReference.uid;
        qResult.result_geojson = `${queryExecuted.numCar}.GeoJSON`;
        qResult.result_csv = `${queryExecuted.numCar}.csv`;
        qResult.result_json = `${queryExecuted.numCar}.json`;
        qResult.statusQueryReport = statusQueryReport.erro_arquivos;
        qResult.numCar = queryExecuted.numCar;

        qResult.erro_geracao_arquivo = resultScript[6];

        let ifInDB = await this._repository_QueryReport.findOne({
          where: {
            farmRef: _farmReference.uid
          }
        })

        if (ifInDB) {
          qResult.uid = ifInDB.uid

          await this._repository_QueryReport.save(qResult)
        }

        return qResult;
      }
    } catch (error) {
      console.error("Erro ao Salvar executando query report", error)
      let ifInDB = await this._repository_QueryReport.findOne({
        where: {
          farmRef: _farmReference.uid
        }
      })

      if (ifInDB) {
        qResult.uid = ifInDB.uid
      }

      qResult.farmRef = _farmReference.uid;
      qResult.statusQueryReport = statusQueryReport.erro_arquivos;

      this._repository_QueryReport.save(qResult);

      return { status: 404, errors: ['Erro no processamento dos arquivos', error] }
    }
  }

  async getQueryReport(request: Request) {
    let qResult: queryReport = new queryReport();

    const _farmReference = await this._repository_FarmReferece.findOne({
      where: {
        numCar: request.params.numCar,
        ano_referencia: request.params.anoRef
      }
    });

    if (!_farmReference)
      return { status: 400, errors: ['Referência não encontrada (FarmReference)'] }

    let queryReportSaved = await this._repository_QueryReport.findOne({
      where: {
        numCar: request.params.numCar,
        ano_referencia: request.params.anoRef
      }
    })

    if (!queryReportSaved)
      return { status: 400, errors: ['Referência não encontrada (QueryReport)'] }

   console.log('result queryReportSaved.erro_geracao_arquivo', queryReportSaved.erro_geracao_arquivo)

    qResult.farmRef = _farmReference.uid;

    qResult.result_geojson = `${_farmReference.numCar}.GeoJSON`;
    qResult.result_csv = `${_farmReference.numCar}.csv`;
    qResult.result_json = `${_farmReference.numCar}.json`;
    qResult.upadateAt = queryReportSaved.upadateAt;
    qResult.statusQueryReport = queryReportSaved.statusQueryReport;
    qResult.erro_geracao_arquivo = queryReportSaved.erro_geracao_arquivo;

    return qResult;
  }

  async one(request: Request) {
    try {
      return this._repository_QueryReport.find({
        where: {
          deleted: false,
          uid: request.params.id,
        }
      });
    } catch {
      return { status: 404, errors: ['Fazenda não encontrada'] }
    }
  }

  async executeRScript(fileName: any, fcar: any, ano_referencia: any) {
    let result = await R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R", "ConsultaCAR", { fcar: fcar, ano_referencia: ano_referencia, versao_biomas: "v08", geoJson: "TRUE" });
    return result
  }

  async executeRScriptDinamizado(fileName: any, fcar: any, ano_referencia: any) {
    let dinamizado = R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR-Dinamizada.R","dinamizar", {fcar: fcar, ano_referencia: ano_referencia, versao_biomas: "v08"});
    return dinamizado
  }

  async executeRScriptBuscar(longitude: any, latitude: any, ano_referencia: any) {
    let result = await R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R", "busCAR", { longitude: longitude, latitude: latitude, ano_referencia: ano_referencia, versao_biomas: "v08" });
    return result
  }

  async _validateToken(token: any) {
    if (token) { //se existe
      try {
        const _userToken = verify(token, config.secretyKey);

        try {
          let _user = await this._repository_User.findOne({ email: _userToken.email });
          if (_user) {
            return _userToken;
          } else {
            return { status: 400, errors: ['Usuário nao encontrado'] }
          }
        } catch (error) {
          console.log(error)
          return { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }
        }
      } catch (error) {
        return { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] }
      }
    } else { //se nao enviado token, recusa acesso
      return { status: 401, errors: ['Para acessar esse recurso você precisa estar autenticado'] };
    }
  }
}