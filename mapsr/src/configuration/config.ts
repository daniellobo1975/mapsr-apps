export default {
  port: process.env.PORT || 3001,
  folderStorage: process.env.URL_STORAGE || '/mnt/volume_mapsr_11may22/mapsr/storege',
  
  // folderStorageNovoCSV: 'C:/Users/ACT/Documents/GitHub/MapsR Daniel/nova versao maps/mapsr_api/src/controller',
  // folderStorageNovoGEOJSON: 'C:/Users/ACT/Documents/GitHub/MapsR Daniel/nova versao maps/mapsr_api/src/controller',
  
  folderStorageNovoCSV: process.env.URL_STORAGE || '/mnt/volume_mapsr_11may22/fazendas/v08/',
  folderStorageNovoGEOJSON: process.env.URL_STORAGE || '/mnt/volume_mapsr_11may22/fazendas/v08/',
  folderStorageNovoJSON: process.env.URL_STORAGE || '/mnt/volume_mapsr_11may22/fazendas/v08/',

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