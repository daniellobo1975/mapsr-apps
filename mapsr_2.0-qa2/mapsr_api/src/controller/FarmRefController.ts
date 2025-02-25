import { getRepository, Repository } from "typeorm";
import { Request } from "express";
import { BaseController } from "./BaseController";
import { verify } from 'jsonwebtoken';
import { Farm } from "../entity/Farm";
import { FarmReferece } from "../entity/FarmReferece";
import { User } from "../entity/User";
import { FileHelper } from "../helpers/fileHelper";
import { farmDefaultReference } from "../entity/farmDefaultReference";
import { queryReport } from "../entity/queryReport";
import { statusQueryReport } from "../entity/enum/statusQueryReport";
import config from '../configuration/config';
import { QueryReportResultModel } from "../helpers/queryReportResultModel";

const R = require('r-integration');

export class FarmRefController extends BaseController<FarmReferece>{
  private _repository_FarmReferece: Repository<FarmReferece>;
  private _repository_FarmDefaultReferece: Repository<farmDefaultReference>;
  private _repository_QueryReport: Repository<queryReport>;
  private _repository_User: Repository<User>;

  constructor() {
    super(FarmReferece, false);

    this._repository_FarmReferece = getRepository<FarmReferece>(FarmReferece);
    this._repository_FarmDefaultReferece = getRepository<farmDefaultReference>(farmDefaultReference);
    this._repository_QueryReport = getRepository<queryReport>(queryReport);
    this._repository_User = getRepository<User>(User);
  }

  async createFarmRefBUSCAR(request: Request) {
    let { longitude, latitude, ano_referencia, numCar } = request.body;

    console.log('numcar', numCar)

    if (!ano_referencia)
      return { status: 400, errors: ['Preencha o ano referencia'] }

    if (!longitude && !latitude && !numCar)
      return { status: 400, errors: ['Preencha o número do car ou latitude e longitude para realizar a consulta.'] }

    if (!numCar) {
      if (!longitude)
        return { status: 400, errors: ['Preencha a Longitude'] }
      if (!latitude)
        return { status: 400, errors: ['Preencha a Latitude'] }
    }

    let token = request.body.token || request.query.token || request.headers['x-token-access'];
    let _userAuth: any;
    _userAuth = this._validateToken(token);

    let _farmRef = <FarmReferece>request.body;
    _farmRef.requestingUser = _userAuth.uid;

    _farmRef.longitude = longitude;
    _farmRef.latitude = latitude;
    _farmRef.ano_referencia = ano_referencia;
    _farmRef.numCar = numCar;

    let _farmRefSaved;

    try {
      let qResult: queryReport = new queryReport();
      let queryReportResultModel = new QueryReportResultModel();

      if (!numCar) {
        let resultScript

        resultScript = await this.executeRScriptBuscar(longitude, latitude, ano_referencia);

        if (resultScript && resultScript[5] != 'error') {
          _farmRef.numCar = resultScript[5];
          const repo = getRepository(FarmReferece);
          _farmRefSaved = await repo.save(_farmRef);

          const _queryReportExecuted = await this._repository_QueryReport.findOne({
            where: {
              numCar: resultScript[5],
              ano_referencia: ano_referencia
            }
          });
          console.log('passou por aqui ...')
          if (_queryReportExecuted != undefined && _queryReportExecuted.ano_referencia == _farmRefSaved.ano_referencia) {
            let folderExistsGeoJson = await FileHelper.validFolderExistAsync(_queryReportExecuted.ano_referencia, "geoJson", _queryReportExecuted.numCar + ".GeoJSON");
            let folderExistsCSV = await FileHelper.validFolderExistAsync(_queryReportExecuted.ano_referencia, "csv", _queryReportExecuted.numCar + ".csv");
            let folderExistsJson = await FileHelper.validFolderExistAsync(_queryReportExecuted.ano_referencia, "json", _queryReportExecuted.numCar + ".json");

            queryReportResultModel.numCar = _queryReportExecuted.numCar;
            queryReportResultModel.ano_referencia = _queryReportExecuted.ano_referencia;
            queryReportResultModel.createAt = _queryReportExecuted.createAt;
            queryReportResultModel.statusQueryReport = _queryReportExecuted.statusQueryReport;
            queryReportResultModel.statusCSV = folderExistsGeoJson ? "Arquivo já existe" : "Arquivo não existe.";
            queryReportResultModel.statusGEOJSON = folderExistsCSV ? "Arquivo já existe" : "Arquivo não existe.";
            queryReportResultModel.statusJson = folderExistsJson ? "Arquivo já existe" : "Arquivo não existe.";
            queryReportResultModel.uuid = _queryReportExecuted.uid;
            console.log('retorno 1', queryReportResultModel)
            return { status: 200, errors: queryReportResultModel }
          }

          qResult.farmRef = _farmRefSaved.uid;
          qResult.ano_referencia = _farmRefSaved.ano_referencia;
          qResult.statusQueryReport = statusQueryReport.recebida;
          qResult.numCar = resultScript[5];

          await this._repository_QueryReport.save(qResult);

          queryReportResultModel.numCar = resultScript[5];
          queryReportResultModel.ano_referencia = _farmRefSaved.ano_referencia;
          queryReportResultModel.createAt = qResult.createAt;
          queryReportResultModel.statusQueryReport = statusQueryReport.recebida;
          queryReportResultModel.statusCSV = "Arquivo não existe.";
          queryReportResultModel.statusGEOJSON = "Arquivo não existe.";
          queryReportResultModel.statusJson = "Arquivo não existe.";
          queryReportResultModel.uuid = qResult.uid;
          console.log('retorno 2', queryReportResultModel)
          return { status: 200, errors: queryReportResultModel };
        }
        else {
          return { status: 400, errors: ['Erro na geração do car, code error:', resultScript[6]] }
        }
      }
      else {
        const repo = getRepository(FarmReferece);
        _farmRefSaved = await repo.save(_farmRef);

        const _queryReportExecutedWithCar = await this._repository_QueryReport.findOne({
          where: {
            numCar: numCar,
            ano_referencia: ano_referencia
          }
        });

        if (_queryReportExecutedWithCar != undefined && _queryReportExecutedWithCar.ano_referencia == ano_referencia) {
          let folderExistsGeoJson = await FileHelper.validFolderExistAsync(_queryReportExecutedWithCar.ano_referencia, "geoJson", _queryReportExecutedWithCar.numCar + ".GeoJSON");
          let folderExistsCSV = await FileHelper.validFolderExistAsync(_queryReportExecutedWithCar.ano_referencia, "csv", _queryReportExecutedWithCar.numCar + ".csv");
          let folderExistsJson = await FileHelper.validFolderExistAsync(_queryReportExecutedWithCar.ano_referencia, "json", _queryReportExecutedWithCar.numCar + ".json");

          queryReportResultModel.numCar = _queryReportExecutedWithCar.numCar;
          queryReportResultModel.ano_referencia = _queryReportExecutedWithCar.ano_referencia;
          queryReportResultModel.createAt = _queryReportExecutedWithCar.createAt;
          queryReportResultModel.statusQueryReport = _queryReportExecutedWithCar.statusQueryReport;
          queryReportResultModel.statusCSV = folderExistsGeoJson ? "Arquivo já existe" : "Arquivo não existe.";
          queryReportResultModel.statusGEOJSON = folderExistsCSV ? "Arquivo já existe" : "Arquivo não existe.";
          queryReportResultModel.statusJson = folderExistsJson ? "Arquivo já existe" : "Arquivo não existe.";
          queryReportResultModel.uuid = _queryReportExecutedWithCar.uid;
          console.log('retorno 3', queryReportResultModel)
          return { status: 200, errors: queryReportResultModel }
        }

        qResult.farmRef = _farmRefSaved.uid;
        qResult.ano_referencia = _farmRefSaved.ano_referencia;
        qResult.statusQueryReport = statusQueryReport.recebida;
        qResult.numCar = numCar;

        await this._repository_QueryReport.save(qResult)

        queryReportResultModel.numCar = numCar;
        queryReportResultModel.ano_referencia = ano_referencia;
        queryReportResultModel.createAt = qResult.createAt;
        queryReportResultModel.statusQueryReport = statusQueryReport.recebida;
        queryReportResultModel.statusCSV = "Arquivo não existe.";
        queryReportResultModel.statusGEOJSON = "Arquivo não existe.";
        queryReportResultModel.statusJson = "Arquivo não existe.";
        queryReportResultModel.uuid = qResult.uid;

        console.log('retorno 4', queryReportResultModel)
        return { status: 200, errors: queryReportResultModel }
      }
    } catch (err) {
      console.log('err.message :>> ', err.message);
      return { status: 400, errors: ['Erro ao salvar'] }
    }
  }

  async createFarmRefCAR(request: Request) {
    let { fcar, ano_referencia } = request.body;

    if (!fcar)
      return { status: 400, errors: ['Preencha o Fcar'] }
    if (!ano_referencia)
      return { status: 400, errors: ['Preencha o Ano Referencia'] }

    let token = request.body.token || request.query.token || request.headers['x-token-access'];
    let _userAuth: any;
    _userAuth = this._validateToken(token);

    let _farmRef = <FarmReferece>request.body;
    _farmRef.requestingUser = _userAuth.uid;

    _farmRef.fcar = fcar;
    _farmRef.ano_referencia = ano_referencia;

    let res

    try {
      const repo = getRepository(FarmReferece);
      res = await repo.save(_farmRef);
    } catch (err) {
      console.log('err.message :>> ', err.message);
      return { status: 400, errors: ['Erro ao salvar'] }
    }

    return res;
  }

  async createFarmRef(request: Request) {
    let { referenceName, farmId, car_shp, car_shx, car_prj, car_dbf, app_shp, app_shx, app_prj, app_dbf, biomas } = request.body;

    if (!referenceName)
      return { status: 400, errors: ['Preencha o nome da Referência'] }
    if (!car_shp || !car_shx || !car_prj || !car_dbf)
      return { status: 400, errors: ['Adicione todos arquivos Car'] }
    if (!app_shp || !app_shx || !app_prj || !app_dbf)
      return { status: 400, errors: ['Adicione todos arquivos App'] }
    if (!biomas)
      return { status: 400, errors: ['Adicione o arquivo Biomas'] }

    let token = request.body.token || request.query.token || request.headers['x-token-access'];
    let _userAuth: any;
    _userAuth = this._validateToken(token);

    let _farmRef = <FarmReferece>request.body;
    _farmRef.requestingUser = _userAuth.uid;
    let file = '';
    let fileName = '';

    if (_farmRef.app_shp) {
      try {
        file = await FileHelper.fileBase64(app_shp, 'shp', null);
        fileName = file.substring(0, file.length - 4);
        _farmRef.app_shp = file;
        if (_farmRef.app_dbf) {
          file = await FileHelper.fileBase64(app_dbf, 'dbf', fileName);
          _farmRef.app_dbf = file;
        }
        if (_farmRef.app_prj) {
          file = await FileHelper.fileBase64(app_prj, 'prj', fileName);
          _farmRef.app_prj = file;
        }
        if (_farmRef.app_shx) {
          file = await FileHelper.fileBase64(app_shx, 'shx', fileName);
          _farmRef.app_shx = file;
        }
      } catch (error) {
        console.log('erro base64', error)
      }
    }

    if (_farmRef.biomas) {
      try {
        file = await FileHelper.fileBase64(biomas, 'tif', null);
        _farmRef.biomas = file;
      } catch (error) {
      }
    }

    if (_farmRef.car_shp) {
      try {
        file = await FileHelper.fileBase64(car_shp, 'shp', null);
        fileName = file.substring(0, file.length - 4);
        _farmRef.car_shp = file;
        if (_farmRef.car_dbf) {
          file = await FileHelper.fileBase64(car_dbf, 'dbf', fileName);
          _farmRef.car_dbf = file;
        }
        if (_farmRef.car_prj) {
          file = await FileHelper.fileBase64(car_prj, 'prj', fileName);
          _farmRef.car_prj = file;
        }
        if (_farmRef.car_shx) {
          file = await FileHelper.fileBase64(car_shx, 'shx', fileName);
          _farmRef.car_shx = file;
        }
      } catch (error) {
        console.log('erro base64', error)
      }
    }

    let res

    try {
      const repo = getRepository(FarmReferece);
      res = await repo.save(_farmRef);
    } catch (err) {
      console.log('err.message :>> ', err.message);
      return { status: 400, errors: ['Erro ao salvar'] }
    }

    return res;
  }

  async one2(request: Request) {
    try {
      if (this.checkNotPermission(request)) return this.errorRoot;
      return this._repository_FarmReferece.findOne({
        where: {
          deleted: false,
          uid: request.params.id,
        }
      });
    } catch {
      return { status: 404, errors: ['Fazenda não encontrada'] }
    }
  }

  async save(request: Request) {
    let { uid, referenceName, farmId, car_shp, car_shx, car_prj, car_dbf, app_shp, app_shx, app_prj, app_dbf, biomas } = request.body;

    if (!referenceName)
      return { status: 400, errors: ['Preencha o nome da Referência'] }
    if (!car_shp || !car_shx || !car_prj || !car_dbf)
      return { status: 400, errors: ['Adicione todos arquivos Car'] }
    if (!app_shp || !app_shx || !app_prj || !app_dbf)
      return { status: 400, errors: ['Adicione todos arquivos App'] }
    if (!biomas)
      return { status: 400, errors: ['Adicione o arquivo Biomas'] }

    let _farmRef = <FarmReferece>request.body;

    const validate = await getRepository(FarmReferece).findOne({ uid: uid });
    const validate1 = await getRepository(FarmReferece).findOne({ uid: uid, deleted: true });
    const validate2 = await getRepository(Farm).findOne({ uid: farmId });

    if (!validate2)
      return { status: 400, errors: ['Fazenda não encontrada'] }
    if (validate) {
      //se já estiver cadastrado (tiver uid), passa
      _farmRef.uid = uid;
    } else if (validate1) {
      _farmRef.deleted = false
      _farmRef.uid = validate1.uid;
    }

    if (!validate2) {
      return { status: 404, errors: ['Fazenda não encontrada'] }
    }

    let file = '';
    let fileName = '';

    if (_farmRef.app_shp) {
      try {
        file = await FileHelper.fileBase64(app_shp, 'shp', null);

        fileName = file.substring(0, file.length - 4);
        _farmRef.app_shp = file;

        if (_farmRef.app_dbf) {
          file = await FileHelper.fileBase64(app_shp, 'dbf', fileName);
          _farmRef.app_shp = file;
        }

        if (_farmRef.app_prj) {
          file = await FileHelper.fileBase64(app_shp, 'prj', fileName);
          _farmRef.app_prj = file;
        }

        if (_farmRef.app_shx) {
          file = await FileHelper.fileBase64(app_shp, 'shx', fileName);
          _farmRef.app_shx = file;
        }
      } catch (error) {
        console.log('erro base64', error)
      }
    }

    if (_farmRef.biomas) {
      file = await FileHelper.fileBase64(biomas, 'tif', null);
      fileName = file.substring(0, file.length - 4);
      _farmRef.app_shp = file;
    }

    if (_farmRef.car_shp) {
      try {
        file = await FileHelper.fileBase64(car_shp, 'shp', null);
        fileName = file.substring(0, file.length - 4);
        _farmRef.car_shp = file;

        if (_farmRef.car_dbf) {
          file = await FileHelper.fileBase64(car_shp, 'dbf', fileName);
          _farmRef.car_shp = file;
        }

        if (_farmRef.car_prj) {
          file = await FileHelper.fileBase64(car_shp, 'prj', fileName);
          _farmRef.car_prj = file;
        }

        if (_farmRef.car_shx) {
          file = await FileHelper.fileBase64(car_shp, 'shx', fileName);
          _farmRef.car_shx = file;
        }
      } catch (error) {
        console.log('erro base64', error)
      }
    }

    let res = await this._repository_FarmReferece.save(_farmRef);
    return res
  };

  async setDefault(request: Request) {
    let { farmId, defaultReference } = request.body;

    //verifica se já possui farmDefaultReference para farmId
    const validate1 = await getRepository(farmDefaultReference).findOne({ farmId: farmId });
    const validate3 = await getRepository(Farm).findOne({ uid: farmId });
    if (!validate3) {
      return { status: 404, errors: ['Fazenda não encontrada'] }
    }

    const validate2 = await getRepository(FarmReferece).findOne({ farmId: farmId, uid: defaultReference });

    if (!validate2) {
      const validate4 = await getRepository(FarmReferece).findOne({ uid: defaultReference });
      if (validate4) {
        return { status: 404, errors: ['Referência não corresponde a fazenda informada'] }
      } else {
        return { status: 404, errors: ['Referência não encontrada '] }
      }
    }

    let _farmDefaultRef: farmDefaultReference = new farmDefaultReference();

    if (validate1) {
      //se já estiver cadastrado (tiver uid)
      _farmDefaultRef.uid = validate1.uid;
    }

    _farmDefaultRef.farmId = farmId;
    _farmDefaultRef.defaultReference = defaultReference;

    let res = await this._repository_FarmDefaultReferece.save(_farmDefaultRef);
    return res
  };

  async oneDefault(request: Request) {
    try {
      return await this._repository_FarmDefaultReferece.findOne({
        where: {
          farmId: request.params.id,
        }
      });
    } catch {
      return { status: 404, errors: ['Fazenda não encontrada'] }
    }
  }

  async allRefFromFarm(request: Request) {
    try {
      return await this._repository_FarmReferece.find({
        where: {
          farmId: request.params.id,
        }
      });
    } catch {
      return { status: 404, errors: ['Fazenda não encontrada'] }
    }
  }

  async _validateToken(token: any) {
    if (token) { //se existe
      try {
        const _userToken = verify(token, config.secretyKey);
        try {
          let _user = await this._repository_User.findOne({ email: _userToken.email });
          if (_user) {
            //ok, passa
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

  async executeRScriptBuscar(longitude: any, latitude: any, ano_referencia: any) {
    let result = await R.callMethod("/mnt/volume_mapsr_11may22/mapsr_2.0-qa2/mapsr_api/src/script_R/mapsR.R", "busCAR", { longitude: longitude, latitude: latitude, ano_referencia: ano_referencia, versao_biomas: "v07" });
    return result
  }
}