# Data: 11-out-2022
# Descrição: código contém as funções previstas no aplicativo
# Autores: Thiago Lôbo e Mario Dotta


##########################################################################################
# Inputs das funções
##########################################################################################

# tipo - identificador da pasta a ser utilizada;
# versao_biomas - versão atual utilizada do Mapbiomas (define a pasta de destino dos outputs);
# ano_referencia - ano da foto do satélite que será utilizada;
# codigo_municipio - código IBGE com 7 dígitos;
# fcar - número CAR sem pontos, vírgulas ou separadores de qualquer natureza


##########################################################################################
# Funções primárias
##########################################################################################
upload.pacotes= function()
{
  # descrição: baixar os pacotes necessários para as operações espaciais.
  
  # pacotes baixados
  library(sf, warn.conflicts = F, quietly = T)
  library(sp, warn.conflicts = F, quietly = T)
  library(stars, warn.conflicts = F, quietly = T)
  library(dplyr, warn.conflicts = F, quietly = T)
  library(readxl, warn.conflicts = F, quietly = T)
  library(measurements, warn.conflicts = F, quietly = T)
  # library(rgeos, warn.conflicts = F, quietly = T)
  
  
  # fazer intersecções aproximadas
  suppressMessages(sf_use_s2(FALSE))
  
}


caminhos= function(tipo, versao_biomas, ano_referencia, codigo_municipio)
{
  # descrição: unificar todos os caminhos (pastas) utilizadas no ambiente do R.

  #  definir raiz do servidor
  base= "/mnt/volume_mapsr_11may22/"
  
  # definir pasta
  if (tipo == "arquivos-de-suporte") {caminho= paste0(base, "/suporte/")}
  if (tipo == "biomas") {caminho= paste0("/mnt/volume_mapsr_11may22/bioma/", versao_biomas, "/")}
  if (tipo == "car-por-municipio") {caminho= paste0(base, "/suporte/car-munics/")}
  if (tipo == "farm-biomas") {caminho= paste0(base, "/fazendas/", versao_biomas, "/", ano_referencia, "/tif/")}
  if (tipo == "principal-output-tif") {caminho= paste0(base, "fazendas/", versao_biomas, "/", ano_referencia, "/tif/")}
  if (tipo == "principal-output-csv") {caminho= paste0(base, "fazendas/", versao_biomas, "/", ano_referencia, "/csv/")}
  if (tipo == "principal-output-geojson") {caminho= paste0(base, "fazendas/", versao_biomas, "/", ano_referencia, "/geoJson/")}
  if (tipo == "raiz-servidor"){caminho= base}
  if (tipo == "sicar-scraper") {caminho= paste0(base, "/sicar-scraper/downloads/2022/")}
  if (tipo == "zip-output-temporario") {caminho= paste0(base, "fazendas/", versao_biomas, "/", ano_referencia, "/", codigo_municipio, "/")}
  
  return(caminho)
}


set.df= function()
{
  # set dataframe
  df= data.frame("","", "", "", "")
  
  # name columns
  names(df)= c("Status", "CAR", "Ano",  "SITUACAO", "CONDICAO")
  
  return(df)
  
}


listar.arquivos.car= function(nome_arquivo, versao_biomas, ano_referencia, codigo_municipio)
{
  # definir caminho dos arquivos a serem listados
  arquivos= list.files(paste0(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), "/sicar"))
  
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


unzip.scrapper= function(codigo_municipio, versao_biomas, ano_referencia)
{
  
  # descrição: criar a pasta temporário e deszipar arquivos do car-scrapper (1o nível).
  
  # apagar (se existir) pasta de repositorio dos arquivos zipados para 1º unzip
  unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
  
  # criar pasta de repositório de todos os arquivos que serão processados
  dir.create(path= caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio))
  
  # 1º unzip: CAR município para temporária
  unzip(paste0(caminhos("sicar-scraper"), "SHAPE_", codigo_municipio, ".zip"),
        exdir= paste0(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), "sicar"))
}


unzip.car= function(arquivo.zip, versao_biomas, ano_referencia, codigo_municipio)
{
  
  # descrição: deszipar os arquivos contidos no shapefile do CAR (2o nível).
  
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
  unlink(paste0(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), pasta.destino),
         recursive = TRUE)
  
  # criar pasta de repositório para 2º unzip
  dir.create(path= paste0(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), pasta.destino))
  
  # 2º unzip: CAR município para temporária
  unzip(paste0(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), "sicar/", arquivo.zip),
        exdir= paste0(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), pasta.destino))
  
}


calculadora= function(base, arquivo_fazenda, nome_arquivo)
{
  # calcular area total
  base$area_total= round(as.numeric(sum(st_area(arquivo_fazenda, na.rm=TRUE)))/10000, digit= 2)
  
  # calcular florestada
  base$area_floresta= round(as.numeric(sum(st_area(arquivo_fazenda[arquivo_fazenda$Legenda=='Area Florestada',], na.rm=TRUE)))/10000, digit= 2)
  
  # calcular deficit
  base$area_deficit=round( base$area_floresta - base$area_total, digit= 2)
  
  # calcular percentual
  base$area_percentual= round((base$area_deficit / base$area_total) * 100, digit= 2)
  
  # renomear variáveis
  base= base %>% rename(!!paste0(nome_arquivo, "_Total"):= "area_total")
  base= base %>% rename(!!paste0(nome_arquivo, "_Florestada"):= "area_floresta")
  base= base %>% rename(!!paste0(nome_arquivo, "_Deficit"):= "area_deficit")
  base= base %>% rename(!!paste0(nome_arquivo, "_Deficit_%"):= "area_percentual")
  
  return(base)
}
 

upload.shapefile = function(codigo_municipio, nome_arquivo, versao_biomas, ano_referencia, verbose)
{
  
  # verbose
  if (verbose!="") {print(paste("Uploading dados da fazenda: ", verbose))}
  
  # criar pasta da consulta e deszipar arquivos do CAR (1o e 2o nível)
  if (nome_arquivo=="AREA_IMOVEL") {unzip.scrapper(codigo_municipio, versao_biomas, ano_referencia)}
  
  # criar lista de arquivos
  lista= listar.arquivos.car(nome_arquivo, versao_biomas, ano_referencia, codigo_municipio)
  
  # contador
  n= 0
  
  for (nome.arquivo.na.lista in lista)
  {
    # atualizar contador
    n= n + 1
    
    # fazer 2o unzip
    unzip.car(nome.arquivo.na.lista, versao_biomas, ano_referencia, codigo_municipio)
    
    # nome do arquivo
    filename= paste0(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), nome_arquivo, "/", nome_arquivo, ".shp")
    
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


limparOutputGeoJson= function(base)
{
  # manter somentes os campos mínimos
  base= base[c("COD_IMOVEL", "SITUACAO", "CONDICAO_I", "Legenda", "geometry")]
  
  return(base)
}


salvar.geoJson= function(objeto.biomas, nome, versao_biomas, ano_referencia, fcar)
{
  # arquivo
  arquivo= paste0(caminhos("principal-output-geojson", versao_biomas, ano_referencia, ""), fcar, ".GeoJSON")
  
  # sempre que rodar uma fazenda arquivo geoJson será deletado ("inicia novo GeoJson")
  if (nome == "FZD") {unlink(arquivo)}
  
  # criar campo com a camada a que se refere
  objeto.biomas$camada= nome
  
  # criar arquivo GeoJson (casos diferentes de FZD, o arquivo GeoJson será anexado ao existente)
  st_write(objeto.biomas,
           dsn= arquivo,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
}


##########################################################################################
# Funções críticas
##########################################################################################
bioma.completo= function(fcar, fazenda, ano_referencia, versao_biomas, codigo_municipio, verbose, geoJson)
{
  
  # verbose
  if (verbose!="") {print(paste("Uploading: ", verbose))}
  
  # definir pasta biomas
  pasta.biomas= paste0(caminhos("principal-output-tif", versao_biomas, ano_referencia, codigo_municipio), fcar, ".tif")
  
  # rotina quando arquivo .tif já existe
  if (file.exists(pasta.biomas)==TRUE)
  {
    # pré-importação do mapbiomas (arquivo já pronto)
    biomas= read_stars(pasta.biomas)
  }
  
  # rotina quando arquivo .tif ainda não existe
  if (file.exists(pasta.biomas)==FALSE)
  {
    # redefine pasta de origem do arquivo
    pasta.biomas= caminhos("biomas", versao_biomas, ano_referencia, "")
    pasta.biomas= paste0(pasta.biomas, "/mapbiomas-brazil-collection-60-brasil-", ano_referencia,"-0000000000-0000000000.tif")
    
    # pré-importação do mapbiomas (gerador do biomas recortado)
    biomas= read_stars(pasta.biomas) %>% st_crop(st_bbox(fazenda))
  }
  
  
  # transformando biomas em sf
  biomas= st_as_sf(biomas)
  
  # renomear campo principal
  colnames(biomas)[1]= "bioma_code" 
  
  # baixar legendas do mapbiomas
  legenda= read_excel(paste0(caminhos("arquivos-de-suporte", versao_biomas, ano_referencia, codigo_municipio), "legendas_24102022.xlsx"))
  
  # adicionar legendas ao arquivo principal
  biomas= merge(x= biomas, y= legenda, by= c("bioma_code"))
  
  # colocando na mesma projeção
  biomas= st_transform(biomas, 4326)
  
  # st_intersection
  farmbiomas= st_intersection(fazenda, biomas)
  
  # manter somentes campos necessários[!]
  farmbiomas= limparOutputGeoJson(farmbiomas)
  
  # salvar geoJson
  if (geoJson==TRUE) {salvar.geoJson(farmbiomas, "FZD", versao_biomas, ano_referencia, fcar)}
  
  return(farmbiomas)
}

 
biomas.parcial= function(nome_arquivo, bioma.fazenda, fcar, coletor, codigo_municipio, versao_biomas, ano_referencia, verbose, geoJson)
{
  # upload do shape completo do bioma secundário
  bioma= tryCatch(
    {
      # upload dos arquivos disponíveis
      area.parcial= upload.shapefile(codigo_municipio, nome_arquivo, versao_biomas, ano_referencia, verbose)
      
      # intersecção com a fazenda
      bioma.parcial= st_intersection(x= area.parcial, y= bioma.fazenda)
      
      # atualização do coletor
      coletor= calculadora(coletor, bioma.parcial, nome_arquivo)
      
      # manter somentes campos necessários
      bioma.parcial= limparOutputGeoJson(bioma.parcial)
      
      # salvar geoJson
      if (geoJson==TRUE)
      {
        if (nome_arquivo== "APP") {geo.name= "APP"}
        if (nome_arquivo== "AREA_CONSOLIDADA") {geo.name= "CON"}
        if (nome_arquivo== "RESERVA_LEGAL") {geo.name= "RLG"}
        if (nome_arquivo== "USO_RESTRITO") {geo.name= "RST"}
        if (nome_arquivo== "VEGETACAO_NATIVA") {geo.name= "VGN"}
        if (nome_arquivo== "SERVIDAO_ADMINISTRATIVA") {geo.name= "SRV"}
        
        salvar.geoJson(bioma.parcial, geo.name, versao_biomas, ano_referencia, fcar)
        }
      
    },
    # se erro, retorna o coletor sem alteração
    error=function(e){coletor})
  
  # retorna coletor com as informações (ou o mesmo coletor, se shapefile tiver algum problema)
  return(coletor)
}


##########################################################################################
# Consultas
##########################################################################################
busCAR = function(longitude, latitude, ano_referencia, versao_biomas)
{
  # pacotes necessário (revisar eventualmente a necessidade de todos)
  upload.pacotes()
  
  # ajustar inputs (evitar erros)
  long= as.numeric(longitude)
  lati= as.numeric(latitude)
  
  # upload do mapa do Brasil
  brazil= st_read(paste0(caminhos("arquivos-de-suporte", versao_biomas, ano_referencia, ""), "br_munic/BR_Municipios_2019.shp" ), quiet = TRUE)
  
  # ajustar projeção do mapa do Brasil
  brazil= st_transform(brazil, 4326)
  
  # referência geográfica (ponto de consulta)
  p1= st_point(c(lati,long))
  p1= st_sfc(p1, crs = 4326)
  
  # identificar cidade
  ## intersecção mapa Brasil e referência geográfica
  munic= st_intersection(x= brazil, y= p1)
  
  ## criar objeto coletor com as informações do NÚMERO do município
  codigo_municipio= as.numeric(as.character(munic$CD_MUN))
  
  # upload car municipio
  car= upload.shapefile(codigo_municipio, "AREA_IMOVEL", versao_biomas, ano_referencia, verbose= "Área Imóvel")
  
  # identificar a fazenda
  farm= st_intersection(x= car, y= p1)
  
  # identificar o CAR
  farm_code= as.character(farm$COD_IMOVEL)
  
  # print do resultado da busca
  # temporario 
  print(paste0("Número CAR: ", farm_code))
  
  # apagar repositorio temporário dos dados da fazenda
  unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
  
  return(farm_code)
  
}


ConsultaCAR = function(fcar, ano_referencia, versao_biomas, geoJson) 
{  
  
  # upload pacotes necessários
  upload.pacotes()
  
  # objetos
  ano_referencia = as.numeric(ano_referencia)

  # identificar município
  codigo_municipio= substr(fcar, start=3, stop=9)
  
  # id CAR oficial (com separadores)
  id.car= paste0(substr(fcar, start=1, stop=2), "-", codigo_municipio, "-", substr(fcar, start=10, stop=41))
   
  # farmbiomas
  ## upload das fazendas do município
  car= upload.shapefile(codigo_municipio, "AREA_IMOVEL", versao_biomas, ano_referencia, verbose= "Área Imóvel")
  ## separar shapefile da fazenda
  fazenda= car[car$COD_IMOVEL==id.car,]
  # upload farmmapbiomas
  farmbiomas= bioma.completo(fcar, fazenda, ano_referencia, versao_biomas, codigo_municipio, "farmbiomas", geoJson)
  
  # dataframe coletor
  resultados= set.df()
  
  # dados cabeçalho
  resultados$Ano= ano_referencia
  resultados$CAR= fcar
  resultados$SITUACAO= fazenda$SITUACAO
  resultados$CONDICAO= fazenda$CONDICAO_I
  resultados$Status= "CAR em Processamento"
  
  # atualizar coletor
  resultados= calculadora(resultados, farmbiomas, "Area_Fazenda")
  resultados= biomas.parcial("APP", farmbiomas, fcar, resultados, codigo_municipio, versao_biomas, ano_referencia, "APP", geoJson)
  resultados= biomas.parcial("RESERVA_LEGAL", farmbiomas, fcar, resultados, codigo_municipio, versao_biomas, ano_referencia, "Reserva Legal", geoJson)
  resultados= biomas.parcial("VEGETACAO_NATIVA", farmbiomas, fcar, resultados, codigo_municipio, versao_biomas, ano_referencia, "Vegetação Nativa", geoJson)
  resultados= biomas.parcial("SERVIDAO_ADMINISTRATIVA", farmbiomas, fcar, resultados, codigo_municipio, versao_biomas, ano_referencia, "Área de Servidão", geoJson)
  resultados= biomas.parcial("USO_RESTRITO", farmbiomas, fcar, resultados, codigo_municipio, versao_biomas, ano_referencia, "Área de Uso Restrito", geoJson)
  resultados= biomas.parcial("AREA_CONSOLIDADA", farmbiomas, fcar, resultados, codigo_municipio, versao_biomas, ano_referencia, "Área Consolidada", geoJson)
  
  # atualizar coletor
  resultados$Status= "CAR em Processado"
  
  # salvar arquivo na pasta
  write.csv(resultados, paste0(caminhos("principal-output-csv", versao_biomas, ano_referencia, codigo_municipio), fcar, ".csv"))
  
  # apagar repositorio temporário dos dados da fazenda
  unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
  
} 
 
# busCAR("-22.050656824840956", "-47.96190036699626", "2020", "v06")
ConsultaCAR("SP354890613CBFC3115AD49A9B51FC014A701B019", "2020", "v06", TRUE)

##########################################################################################
# Fim
##########################################################################################
