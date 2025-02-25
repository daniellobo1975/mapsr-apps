# Data: 30-set-2022
# Objetivo: minimizar tamanho do arquivo do Mapbiomas
# Output: Mapbiomas (".tif") da área da fazenda

# Notas: atenção no loop lista.car + unzip car pode não estar capturando todos arquivos != AREA_IMOVEL


#############################################
# Parâmetros
#############################################

# parâmetros
AnoReferencia= "2008"
versao_biomas= "v06"
estado= "SP"



#############################################
# Funções
#############################################
caminhos= function(tipo, versao_biomas, AnoReferencia, munic_code)
{
  if (tipo == "raiz-servidor"){caminho= "/mnt/volume_mapsr_11may22/"}
  if (tipo == "biomas") {caminho= "/mnt/volume_mapsr_11may22/bioma/"}
  if (tipo == "car-por-municipio") {caminho= "/mnt/volume_mapsr_11may22/suporte/car-munics/"}
  if (tipo == "arquivos-de-suporte") {caminho= "/mnt/volume_mapsr_11may22/suporte/"}
  if (tipo == "sicar-scraper") {caminho= "/mnt/volume_mapsr_11may22/sicar-scraper/downloads/2022/"}
  if (tipo == "zip-output-temporario")
    {caminho= paste0("/mnt/volume_mapsr_11may22/fazendas/", versao_biomas, "/", AnoReferencia, "/", munic_code, "/")}
  if (tipo == "principal-output")
    {caminho= paste0("/mnt/volume_mapsr_11may22/fazendas/v06/", AnoReferencia, "/tif/")}
  return(caminho)
}


upload.packages= function()
{
  library(abind, quietly= TRUE)
  library(geosphere, quietly= TRUE)
  library(ggplot2, quietly= TRUE)
  library(raster, quietly= TRUE)
  library(sf, quietly= TRUE)
  library(sp, quietly= TRUE)
  library(stars, quietly= TRUE)
  library(rgeos, quietly= TRUE)
  library(readxl, quietly= TRUE)
  library(dplyr, quietly= TRUE)
  
}
 

upload_biomas_terra= function(AnoReferencia, versao_biomas)
{
  # definir pasta biomas
  pasta.biomas= paste0(caminhos("biomas", versao_biomas, AnoReferencia, ""), versao_biomas)
  
  # localização do arquivo
  if (versao_biomas == "v06")
    {pasta.biomas= paste0(pasta.biomas, "/mapbiomas-brazil-collection-60-brasil-", AnoReferencia,"-0000000000-0000000000.tif")}
  
  # pré-importação do mapbiomas
  biomas= terra::rast(pasta.biomas)

  return(biomas)
}


upload_biomas= function(fazenda, AnoReferencia, versao_biomas)
{
  # definir pasta biomas
  pasta.biomas= paste0(caminhos("biomas", versao_biomas, AnoReferencia, ""), versao_biomas)
  
  # localização do arquivo
  if (versao_biomas == "v06")
  {pasta.biomas= paste0(pasta.biomas, "/mapbiomas-brazil-collection-60-brasil-", AnoReferencia,"-0000000000-0000000000.tif")}
  
  # ajustar projeção
  fazenda= st_transform(fazenda, 4326)
  
  # pré-importação do mapbiomas
  biomas= read_stars(pasta.biomas) %>% st_crop(st_bbox(fazenda))
  
  return(biomas)
}


unzip_scrapper= function(munic_code, versao_biomas, AnoReferencia)
{
  # apagar (se existir) pasta de repositorio dos arquivos zipados para 1º unzip
  unlink(caminhos("zip-output-temporario", versao_biomas, AnoReferencia, munic_code), recursive = TRUE)
  
  # criar pasta de repositório de todos os arquivos que serão processados
  dir.create(path= caminhos("zip-output-temporario", versao_biomas, AnoReferencia, munic_code))
  
  # 1º unzip: CAR município para temporária
  unzip(paste0(caminhos("sicar-scraper"), "SHAPE_", munic_code, ".zip"),
        exdir= paste0(caminhos("zip-output-temporario", versao_biomas, AnoReferencia, munic_code), "sicar"))
}


unzip_car= function(arquivo.zip, versao_biomas, AnoReferencia, munic_code)
{
  
  # ajustar car folder em caso de exceção (retirar os últimos 2 caracteres)
  if (!grepl("[0-9]", arquivo.zip))
  {
    # criar pasta destino "sem o .zip"
    pasta.destino= substr(arquivo.zip, start=1, stop= nchar(arquivo.zip)-4)
  }
  
  if (grepl("[0-9]", arquivo.zip))
  {
    pasta.destino= substr(arquivo.zip, start=1, stop= nchar(arquivo.zip)-6)
  }
  
  # apagar (se existir) pasta de repositorio dos arquivos zipados para 2º unzip
  unlink(paste0(caminhos("zip-output-temporario", versao_biomas, AnoReferencia, munic_code), pasta.destino),
         recursive = TRUE)
  
  # criar pasta de repositório para 2º unzip
  dir.create(path= paste0(caminhos("zip-output-temporario", versao_biomas, AnoReferencia, munic_code), pasta.destino))
  
  # 2º unzip: CAR município para temporária
  unzip(paste0(caminhos("zip-output-temporario", versao_biomas, AnoReferencia, munic_code), "sicar/", arquivo.zip),
        exdir= paste0(caminhos("zip-output-temporario", versao_biomas, AnoReferencia, munic_code), pasta.destino))
  
}


listar.arquivos.car= function(nome_arquivo, versao_biomas, AnoReferencia, munic_code)
{
  # definir caminho dos arquivos a serem listados
  arquivos= list.files(paste0(caminhos("zip-output-temporario", versao_biomas, AnoReferencia, munic_code), "/sicar"))
  
  # objetos
  lista= list()
  tipo= nome_arquivo
  
  # alimentar as listas
  for (v in arquivos) 
  {
    
    # atualiza lista
    if (grepl(tipo, v, fixed = TRUE)){lista= append(lista, list(v))}
    
    # remove objetos usados
    remove(v)
  }
  
  return(lista)
  
}


upload.farms = function(munic_code, nome_arquivo, versao_biomas)
{
  # criar pasta da consulta e deszipar arquivos do CAR (1o e 2o nível)
  if (nome_arquivo=="AREA_IMOVEL") {unzip_scrapper(munic_code, versao_biomas, AnoReferencia)}
  
  # criar lista de arquivos
  lista= listar.arquivos.car(nome_arquivo, versao_biomas, AnoReferencia, munic_code)
  
  # contador
  n= 0
  
  for (nome.arquivo.na.lista in lista)
  {
    # atualizar contador
    n= n + 1
    
    # fazer 2o unzip
    unzip_car(nome.arquivo.na.lista, versao_biomas, AnoReferencia, munic_code)
    
    # nome do arquivo
    filename= paste0(caminhos("zip-output-temporario", versao_biomas, AnoReferencia, munic_code), nome_arquivo, "/", nome_arquivo, ".shp")
    
    # baixar arquivos
    if (n==1)
    {
      # car= vect(filename)
      car= st_read(filename, quiet=TRUE)
    }
    if (n!=1) 
    {
      # upload dos dados em base temporário
      # temp= vect(filename, quiet=TRUE)
      temp= st_read(filename, quiet=TRUE)
      
      # fazer bind das bases
      car= rbind(car, temp)
      
      # remover objetos usados
      remove(temp)
    }
    
    # manter os campos desejados
    if (nome_arquivo!="AREA_IMOVEL") {car= car["geometry"]}
    
  }
  
  car= st_transform(car, 4326)
  
  return(car)
}



ConsultaCAR = function(car, NumeroCAR, mapbiomas, AnoReferencia, versao_biomas) 
{  
  
  # objetos
  ncar = NumeroCAR
  AnoReferencia = as.numeric(AnoReferencia)

  # identificar município
  municipio= substr(ncar, start=3, stop=9)
  
  # id CAR oficial (com separadores)
  fcar= paste0(substr(ncar, start=1, stop=2), "-", municipio, "-", substr(ncar, start=10, stop=41))
  
  # manter somente uma fazenda no car
  farm= car[car$COD_IMOVEL==fcar,]

  # upload mapbiomas
  mapbiomas= upload_biomas(farm, AnoReferencia, versao_biomas)
  
  # recorte exato da fazenda
  ## farm.crop= terra::crop(mapbiomas, farm)
  # farm.mask= mask(farm.crop, farm)
  
  # salvar como tiff
  # write_stars(mapbiomas, dsn= paste0(caminhos("principal-output", versao_biomas, AnoReferencia, municipio), ncar, ".tif"))
  write_stars(mapbiomas, dsn= paste0(caminhos("principal-output", versao_biomas, AnoReferencia, municipio), ncar, ".tif"), options = c("COMPRESS=DEFLATE", "PREDICTOR=2", "ZLEVEL=6"), overwrite= TRUE)
  # writeRaster(mapbiomas, dsn= paste0(caminhos("principal-output", versao_biomas, AnoReferencia, municipio), ncar, ".tif"), options = c("COMPRESS=DEFLATE", "PREDICTOR=2", "ZLEVEL=6"), overwrite= TRUE)
  #writeRaster(mapbiomas,
  #            filename= paste0(caminhos("principal-output", versao_biomas, AnoReferencia, municipio), ncar, ".tif"),
  #            gdal=c("COMPRESS=DEFLATE"),
  #            overwrite= TRUE)
  
  # apagar pasta com arquivos zipados
  unlink(caminhos("zip-output-temporario", versao_biomas, AnoReferencia, municipio), recursive = TRUE)
  
}


 
 
#############################################
# Loop
#############################################

#  pacotes necessarios
upload.packages()

# brazil municipalities from defined state
brazil= read_excel(paste0(caminhos("arquivos-de-suporte", versao_biomas, AnoReferencia, ""), "IBGEmunic.xlsx"))
brazil= subset(brazil, brazil$uf== estado)
# brazil= subset(brazil, brazil$munic7== 3548906)



# loop pelo Brasil
for (munic_code in brazil$munic7) 
{
   
  try({
    
    # gerar base de cars
    car= upload.farms(munic_code, "AREA_IMOVEL", versao_biomas)
    # car= subset(car, car$COD_IMOVEL== "SP-3548906-13CBFC3115AD49A9B51FC014A701B019")
    
    # upload da base de CARS
    munic= read.csv(paste0(caminhos("car-por-municipio", versao_biomas, ano, munic_code), munic_code, ".csv"))
    # munic= munic[1,]
    munic= munic['NUMREGCAR']
  
    
    # criar lista de municipios (ajuste temporário)
    lista= as.list(c(""))
    
    # loop nos municípios
    for (v in munic$NUMREGCAR){lista= append(lista, v)}
    ## for (v in as.list("SP354890613CBFC3115AD49A9B51FC014A701B019")){lista= append(lista, v)}
    
    lista[1]= NULL
 
    # contador 
    n= 0
    
    # TIFF loop
    for (z in lista)
    {
      # atualizar counter
      n= n + 1
       
      # print do status  
      print(paste0("n=", n,  " - Processando CAR = ", z))
      
      # gerar tip
      try({ConsultaCAR(car, z, mapbiomas, AnoReferencia, versao_biomas) })
    }  
    
  })
  
}
