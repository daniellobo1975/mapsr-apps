export default {
  port: 3002,
  folderStorage: process.env.URL_STORAGE || '/mnt/volume_mapsr_11may22/mapsr/storege',
  
  folderStorageNovoCSV: process.env.URL_STORAGE || '/mnt/volume_mapsr_11may22/fazendas_3002/v09/',
  folderStorageNovoGEOJSON: process.env.URL_STORAGE || '/mnt/volume_mapsr_11may22/fazendas_3002/v09/',
  folderStorageNovoJSON: process.env.URL_STORAGE || '/mnt/volume_mapsr_11may22/fazendas_3002/v09/',

  pictureQuality: process.env.PICTURE_QUALITY || 80,
  secretyKey: process.env.SECRETYKEY || 'de0b716f-e58a-471a-bfca-80be3af4c453',
  publicRoutes: process.env.PUBLICROUTES || [
    'user/create',
    'user/auth',
    'recover',
    'user/recover',
    'user/reset',
    'farm/create',
    'farmref/create',
    'base64'
  ],
  mailCredencials: {
    host: "smtp.mailtrap.io",
    port: 2525,
    user: "dasadsa",
    pass: "bhjasghjsagjhag",
    mailName: "noreplay@email.com",
    siteUrl: "http://localhost:4200/resetarsenha/",
    subject: "Redefinição de senha"
  }
}