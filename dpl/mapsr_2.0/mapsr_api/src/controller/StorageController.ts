import { Request } from 'express';
import variables from '../configuration/config';
import * as path from 'path';

const fsPromises = require("fs/promises");
const fs = require('fs');

export class StorageController {
  async getFile(req: Request) {
    const filePath = `${variables.folderStorage}/${req.params.filename}`;
    return { file: path.resolve(filePath) };
  }

  async getOutputFile(req: Request) {
    const filePath = `${variables.folderStorage}/output/${req.params.filename}`;
    return { file: path.resolve(filePath) };
  }

  async lerArquivo(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      let objetoJson = JSON.parse(data);

      objetoJson.features.forEach((e) => {
        e.geometry = JSON.stringify(e.geometry);
      });

      console.log('leu tudo');
      return objetoJson;
    } catch (err) {
      console.error('Erro ao ler o arquivo:', err);
      throw err;
    }
  }

  async getOutputReportFile(req: Request) {
    const typeArchive = req.params.filename.split('.');
    const yearFolder = req.params.year;

    if (typeArchive[1].toString().toLowerCase().includes('geojson')) {
      //const filePath = `${variables.folderStorageNovoGEOJSON}/${req.params.filename}`;
      const filePath = `${variables.folderStorageNovoGEOJSON}/${yearFolder}/geoJson/${req.params.filename}`;
      // const filePath = `C:/Users/ACT/Documents/GitHub/MapsR Daniel/nova versao maps/mapsr_api/src/controller/${req.params.filename}`;

      // fs.readFile(filePath, 'utf8', (err, data) => {
      //   if (err) {
      //     console.error('Erro ao ler o arquivo:', err);
      //     return;
      //   }

      //   let objetoJson = JSON.parse(data);

      //   objetoJson.features.forEach((e) => {
      //     e.geometry = JSON.stringify(e.geometry);
      //   });

      //   console.log('Leitura concluída');
      //   console.log(objetoJson);
      // });

      const data = await fsPromises.readFile(filePath, 'utf8');

      let objetoJson = JSON.parse(data);

      objetoJson.features.forEach((e) => {
        e.geometry = JSON.stringify(e.geometry);
      });

      console.log('leu tudo2', data);
      return objetoJson;
    }
    else if (typeArchive[1].toString().toLowerCase().includes('csv')) {
      const filePath = `${variables.folderStorageNovoCSV}/${yearFolder}/csv/${req.params.filename}`;
      return { file: path.resolve(filePath) };
    }
    else if (typeArchive[1].toString().toLowerCase().includes('json')) {
      const filePath = `${variables.folderStorageNovoJSON}/${yearFolder}/json/${req.params.filename}`;
      return { file: path.resolve(filePath) };
    }
  }

  async deleteFile(req: Request) {
    const filePath = `${variables.folderStorage}/${req.params.filename}`;
    try {
      await fsPromises.unlink(filePath);
      return { status: 200, errors: ['Arquivo removido com sucesso'] }

    } catch (err) {
      console.log(err);
      return { status: 404, errors: ['Arquivo não encontrado'] }
    }
  };
}