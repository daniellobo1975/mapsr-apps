# Data: 17-10-2023
# Descrição: código contém as funções previstas no aplicativo
# Autores: Thiago Lôbo & Mario Dotta
# últimas cinco atualizações (em ordem cronológica):
  # 01. atualização do caminho do CAR
  # 02. latitude e longitude do centróide das propriedades

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
  library(rjson)
  # library(rgeos, warn.conflicts = F, quietly = T)
  
  # fazer intersecções aproximadas
  suppressMessages(sf_use_s2(FALSE))
  
}


caminhos= function(tipo, versao_biomas, ano_referencia, codigo_municipio)
{
  # descrição: unificar todos os caminhos (pastas) utilizadas no ambiente do R.

  #  definir raiz do servidor
  base= "/mnt/volume_mapsr_11may22/"
  mnt= "/mnt/volume_sfo3_01/"
  
  # definir pasta
  if (tipo == "arquivos-de-suporte") {caminho= paste0(base, "/suporte/")}
  if (tipo == "biomas") {caminho= paste0("/mnt/volume_mapsr_11may22/bioma/", versao_biomas, "/")}
  if (tipo == "car-por-municipio") {caminho= paste0(base, "/suporte/car-munics/")}
  if (tipo == "farm-biomas") {caminho= paste0(base, "/fazendas/", versao_biomas, "/", ano_referencia, "/tif/")}
  if (tipo == "principal-output-tif") {caminho= paste0(base, "fazendas/", versao_biomas, "/", ano_referencia, "/tif/")}
  if (tipo == "principal-output-csv") {caminho= paste0(base, "fazendas/", versao_biomas, "/", ano_referencia, "/csv/")}
  if (tipo == "principal-output-json") {caminho= paste0(base, "fazendas/", versao_biomas, "/", ano_referencia, "/json/")}
  if (tipo == "principal-output-geojson") {caminho= paste0(base, "fazendas/", versao_biomas, "/", ano_referencia, "/geoJson/")}
  if (tipo == "raiz-servidor"){caminho= base}
  # if (tipo == "sicar-scraper") {caminho= paste0(base, "/sicar-scraper/downloads/2022/")}
  if (tipo == "sicar-scraper") {caminho= paste0(mnt, "downloads/sicar-scrapper/2023-10-16-Brasil/")}
  if (tipo == "zip-output-temporario") {caminho= paste0(base, "fazendas/", versao_biomas, "/", ano_referencia, "/", codigo_municipio, "/")}
  
  return(caminho)
}


set.df= function()
{
  # criar dataframe
  df= data.frame("")
  
  # colunas de identificação
  names(df)= c("temp")
  
  # remove temp
  df$temp= NULL
  
  # colunas calculadas
  lista= c("Ano","CAR", "Status", "SITUACAO", "CONDICAO",
           "Area_Fazenda_Total", "Area_Fazenda_Florestada",
           "APP_Total", "APP_Florestada",
           "RESERVA_LEGAL_Total", "RESERVA_LEGAL_Florestada",
           "VEGETACAO_NATIVA_Total", "VEGETACAO_NATIVA_Florestada",
           "SERVIDAO_ADMINISTRATIVA_Total", "SERVIDAO_ADMINISTRATIVA_Florestada",
           "USO_RESTRITO_Total", "USO_RESTRITO_Florestada",
           "AREA_CONSOLIDADA_Total", "AREA_CONSOLIDADA_Florestada")
  
  
  # loop para criar as variáveis
  for (n in 1:length(lista))
  {
    # criar variável temporária
    df$temp= NaN
    
    # renomear variável temporaria
    names(df)[n]= lista[n]
  }
  
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


calculadora= function(arquivo_fazenda, vtype)
{
  # calculadora: efetua o cálculo dos campos área total (he), area floresta (he), deficit florestal (he) e deficit percentual (%)

  # definir value como NaN
  value= NaN
  
  # calcular area
  if (vtype=="fazenda"){value= try(round(as.numeric(sum(st_area(arquivo_fazenda, na.rm=TRUE)))/10000, digit= 2), silent= TRUE)}
  if (vtype=="floresta") {value= try(round(as.numeric(sum(st_area(arquivo_fazenda[arquivo_fazenda$Legenda=='Area Florestada',], na.rm=TRUE)))/10000, digit= 2), silent= TRUE)}
  
  return(value)
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
      car= st_read(filename, quiet=TRUE, options = "ENCODING=UTF-8")
    }
    if (n!=1) 
    {
      # upload dos dados em base temporário
      # temp= vect(filename, quiet=TRUE)
      temp= st_read(filename, quiet=TRUE, options = "ENCODING=UTF-8")
      
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


limparGeometria= function(base, nome, ano_referencia)
{
  # criar campo com a camada a que se refere 
  base$camada= nome
  
  # criar campo ano
  base$ano= ano_referencia
  
  # renover COD_IMOVEL
  names(base)[1]= "CAR"

  # manter somentes os campos mínimos
  base= base[c("CAR", "ano", "camada", "Legenda", "geometry")]
  
  # summarizar campos
  base= base[c("CAR", "ano", "camada","Legenda")] %>%  group_by(CAR, ano, camada, Legenda)  %>% summarise()

  return(base)
  
}


salvar.geoJson= function(objeto.biomas, nome, versao_biomas, ano_referencia, id.car)
{
  # arquivo
  arquivo= paste0(caminhos("principal-output-geojson", versao_biomas, ano_referencia, ""), id.car, ".GeoJSON")

  # sempre que rodar uma fazenda arquivo geoJson será deletado ("inicia novo GeoJson") 
  if (nome == "FZD") {unlink(arquivo)}

  # criar arquivo GeoJson (casos diferentes de FZD, o arquivo GeoJson será anexado ao existente)
  st_write(objeto.biomas,
           dsn= arquivo,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
}


coletor.erros= function(info1, info2, info3, col_names, df= FALSE)
{
  # criar coletor
  coletor= list("", "", "")
  names(coletor)= c(col_names)
  
  # preencher coletor
  coletor[1]= info1
  coletor[2]= info2
  coletor[3]= info3
  
  # lista para dataframe
  if (df==TRUE) {coletor= data.frame(coletor)}
  
  # retornar coletor de erro
  return(coletor)
  
}


adicionar.coordenadas= function(objeto, geometria)
{
  # adicionar latitude e longitude
  
  # definir o centroide da geometria
  centroid= st_centroid(geometria)
  
  # transformar em coordenadas
  centroid= st_coordinates(centroid)
  
  # inputar no arquivo destino
  objeto$latitude= centroid[1,2]
  objeto$longitude= centroid[1,1]
  
  return(objeto)
  
}

##########################################################################################
# Funções críticas
##########################################################################################
bioma.completo= function(id.car, fazenda, ano_referencia, versao_biomas, codigo_municipio, verbose, geoJson)
{
  
  # verbose
  if (verbose!="") {print(paste("Uploading: ", verbose))}
  
  # definir pasta biomas
  pasta.biomas= paste0(caminhos("principal-output-tif", versao_biomas, ano_referencia, codigo_municipio), id.car, ".tif")
  
  # rotina quando arquivo .tif já existe
  if (file.exists(pasta.biomas)==TRUE)
  {
    # pré-importação do mapbiomas (arquivo já pronto)
    biomas= read_stars(pasta.biomas)
  }
  
  # rotina quando arquivo .tif ainda não existe
  if (file.exists(pasta.biomas)==FALSE) 
  {
    # set filename
    if (versao_biomas=="v06") {filename= "/mapbiomas-brazil-collection-60-brasil-"}
    if (versao_biomas=="v07") {filename= "/mapbiomas-brazil-collection-70-brasil-"}
  
    
    # redefine pasta de origem do arquivo
    pasta.biomas= caminhos("biomas", versao_biomas, ano_referencia, "")
    pasta.biomas= paste0(pasta.biomas, filename, ano_referencia,"-0000000000-0000000000.tif")
    
    # pré-importação do mapbiomas (gerador do biomas recortado)
    biomas= read_stars(pasta.biomas) %>% st_crop(st_bbox(fazenda))
  }
  
  # transformando biomas em sf
  biomas= st_as_sf(biomas)
  
  # renomear campo principal
  colnames(biomas)[1]= "bioma_code" 
  
  # agrupar por codigo do bioma
  biomas= biomas %>%  group_by(bioma_code)  %>% summarise()
  
  # baixar legendas do mapbiomas
  legenda= read_excel(paste0(caminhos("arquivos-de-suporte", versao_biomas, ano_referencia, codigo_municipio), "legendas_24102022.xlsx"))
  
  # adicionar legendas ao arquivo principal
  biomas= merge(x= biomas, y= legenda, by= c("bioma_code"))
  
  # colocando na mesma projeção
  biomas= st_transform(biomas, 4326)
  
  # st_intersection
  farmbiomas= st_intersection(fazenda, biomas)

  # limpar geoJson
  farmbiomas.geoJson= limparGeometria(farmbiomas, "FZD", ano_referencia)
  
  # atribuir latitude e longitude 
  farmbiomas.geoJson= adicionar.coordenadas(farmbiomas.geoJson, farmbiomas)

  # atribuir sub_camada para o 1o arquivo (sub_camada: PRM = primaria)
  farmbiomas.geoJson$sub_camada= "PRM"
  
  # salvar geoJson
  if (geoJson==TRUE) {salvar.geoJson(farmbiomas.geoJson, "FZD", versao_biomas, ano_referencia, id.car)}
  
  return(farmbiomas)
}

 
biomas.parcial= function(nome_arquivo, bioma.fazenda, id.car, coletor, codigo_municipio, versao_biomas, ano_referencia, verbose, geoJson)
{
  # upload do shape completo do bioma secundário
  bioma= tryCatch(
    {
      # upload dos arquivos disponíveis
      area.parcial= upload.shapefile(codigo_municipio, nome_arquivo, versao_biomas, ano_referencia, verbose)
      
      # intersecção com a fazenda
      bioma.parcial= st_intersection(x= area.parcial, y= bioma.fazenda)
      
      # nome da camada
      if (nome_arquivo== "APP") {geo.name= "APP"}
      if (nome_arquivo== "AREA_CONSOLIDADA") {geo.name= "CON"}
      if (nome_arquivo== "RESERVA_LEGAL") {geo.name= "RLG"}
      if (nome_arquivo== "USO_RESTRITO") {geo.name= "RST"}
      if (nome_arquivo== "VEGETACAO_NATIVA") {geo.name= "VGN"}
      if (nome_arquivo== "SERVIDAO_ADMINISTRATIVA") {geo.name= "SRV"}
      
      # limpar geometria
      bioma.parcial= limparGeometria(bioma.parcial, geo.name, ano_referencia)
      
      
      if (nome_arquivo=="APP")
        {
        coletor$APP_Total= calculadora(bioma.parcial, vtype= "fazenda")
        coletor$APP_Florestada= calculadora(bioma.parcial, vtype= "floresta")
      }
      
      if (nome_arquivo=="RESERVA_LEGAL")
      {
        coletor$RESERVA_LEGAL_Total= calculadora(bioma.parcial, vtype= "fazenda")
        coletor$RESERVA_LEGAL_Florestada= calculadora(bioma.parcial, vtype= "floresta")
      }
      
      if (nome_arquivo=="VEGETACAO_NATIVA")
      {
        coletor$VEGETACAO_NATIVA_Total= calculadora(bioma.parcial, vtype= "fazenda")
        coletor$VEGETACAO_NATIVA_Florestada= calculadora(bioma.parcial, vtype= "floresta")
      }
      
      if (nome_arquivo=="SERVIDAO_ADMINISTRATIVA")
      {
        coletor$SERVIDAO_ADMINISTRATIVA_Total= calculadora(bioma.parcial, vtype= "fazenda")
        coletor$SERVIDAO_ADMINISTRATIVA_Florestada= calculadora(bioma.parcial, vtype= "floresta")
      }
      
      if (nome_arquivo=="USO_RESTRITO")
      {
        coletor$USO_RESTRITO_Total= calculadora(bioma.parcial, vtype= "fazenda")
        coletor$USO_RESTRITO_Florestada= calculadora(bioma.parcial, vtype= "floresta")
      }
      
      if (nome_arquivo=="AREA_CONSOLIDADA")
      {
        coletor$AREA_CONSOLIDADA_Total= calculadora(bioma.parcial, vtype= "fazenda")
        coletor$AREA_CONSOLIDADA_Florestada= calculadora(bioma.parcial, vtype= "floresta")
      }
      
      # salvar geoJson
      if (geoJson==TRUE)
      {
        
        # atribuir latitude e longitude para as camadas
        bioma.parcial= adicionar.coordenadas(bioma.parcial, geometria= bioma.fazenda)
        
        # atribuir sub-camada (PRM= camada primária)
        bioma.parcial$sub_camada= "PRM"
        
        # salvar arquivo
        salvar.geoJson(bioma.parcial, geo.name, versao_biomas, ano_referencia, id.car)
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
# busCAR = function(longitude, latitude, ano_referencia, versao_biomas)
busCAR = function(latitude, longitude, ano_referencia, versao_biomas)
{
  # pacotes necessário (revisar eventualmente a necessidade de todos)
  upload.pacotes()
  
  # ajustar inputs (evitar erros)
  lati= as.numeric(latitude)
  long= as.numeric(longitude)
  
  # upload do mapa do Brasil
  brazil= st_read(paste0(caminhos("arquivos-de-suporte", versao_biomas, ano_referencia, ""), "br_munic/BR_Municipios_2019.shp" ), quiet = TRUE, options = "ENCODING=UTF-8")
  
  # ajustar projeção do mapa do Brasil
  brazil= st_transform(brazil, 4326)
  
  # referência geográfica (ponto de consulta)
  p1= st_point(c(long,lati))
  p1= st_sfc(p1, crs = 4326)
  
  # identificar cidade
  
  ## intersecção mapa Brasil e referência geográfica
  munic= st_intersection(x= brazil, y= p1)
  
  # se lat-lon fora do Brasil (fim da rotina e cria-se objeto com erro -- farm_code)
  if (dim(munic)[1]==0) 
  {
    # criar coletor
    coletor= list("", "", "")
    names(coletor)= c("id", "error_code", "system_error")
    
    # preencher coletor
    coletor[1]= "error"
    coletor[2]= "BS0001"
    coletor[3]= "none"
    
    # lista para dataframe
    coletor= data.frame(coletor)
    
    # apagar repositorio temporário dos dados da fazenda
    unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
    
    # retornar coletor de erro
    return(coletor)
  }
  
  # se lat-lon dentro do Brasil (rotina continua)
  if (dim(munic)[1]!=0) 
  {
    # criar objeto coletor com as informações do NÚMERO do município [pensar se aqui pode ter algum erro]
    codigo_municipio= as.numeric(as.character(munic$CD_MUN))
    
    # upload car municipio
    car= tryCatch(
      {
        # upload do shapefile municipal contendo as fazendas
        upload.shapefile(codigo_municipio, "AREA_IMOVEL", versao_biomas, ano_referencia, verbose= "")},
      error= function(e)
      {
        # criar coletor
        coletor= list("", "", "")
        names(coletor)= c("id", "error_code", "system_error")
        
        # preencher coletor
        coletor[1]= "error"
        coletor[2]= "BS0002"
        coletor[3]= paste(e)
        
        # apagar repositorio temporário dos dados da fazenda
        unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
        
        # retornar coletor de erro
        return(coletor)
      }
    )
    
    # se car for da classe lista, interromper programa e retornar objeto lista com descrição dos erros
    if (class(car)=="list")
    {
      # lista para dataframe
      car= data.frame(car)
      
      return(car)
    }
    
    # identificar a fazenda
    farm=  st_intersection(x= car, y= p1) 
    
    # se o ponto não estiver no contida nas áreas com fazenda, interromper programa
    if (dim(farm)[1]==0) 
    {
      # criar coletor
      coletor= list("", "", "")
      names(coletor)= c("id", "error_code", "system_error")
      
      # preencher coletor
      coletor[1]= "error"
      coletor[2]= "BS0003"
      coletor[3]= "none"
      
      # lista para dataframe
      coletor= data.frame(coletor)
      
      # apagar repositorio temporário dos dados da fazenda
      unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
      
      # retornar coletor de erro
      return(coletor)
    }
    
    # identificar o id CAR
    farm_code= tryCatch(
      {
        # filtrar o código id CAR da base municipal
        as.character(farm$COD_IMOVEL)
      },
      error= function(e)
      {
        # criar coletor
        coletor= list("", "", "")
        names(coletor)= c("id", "error_code", "system_error")
        
        # preencher coletor
        coletor[1]= "error"
        coletor[2]= "BS0004"
        coletor[3]= paste(e)
        
        # apagar repositorio temporário dos dados da fazenda
        unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
        
        # retornar coletor de erro
        return(coletor)
      }
    )
    
    # se farm_code for da classe lista, interromper programa e retornar objeto lista com descrição dos erros
    if (class(farm_code)=="list")
    {
      # lista para dataframe
      farm_code= data.frame(farm_code)
      
      return(farm_code)
    }
    
    # execução sem erro, gerar coletor com id da fazenda e nenhum registro de erro
    coletor= list("", "", "")
    names(coletor)= c("id", "error_code", "system_error")
    
    # preencher coletor
    coletor[1]= farm_code
    coletor[2]= "none"
    coletor[3]= "none"
    
    # lista para dataframe
    coletor= data.frame(coletor)
    
    return(coletor)
    
  }
}


ConsultaCAR = function(fcar, ano_referencia, versao_biomas, geoJson) 
{  

  # upload pacotes necessários
  upload.pacotes()
  
  # objetos
  ano_referencia = as.numeric(ano_referencia)
  
  # id CAR oficial (com separadores)
  ## se CAR informado contém número menor ou igual a 40 caracteres, programa é interrompido (CC0001: CAR informado não está completo)
  if (nchar(fcar)<=40) {return(coletor.erros("error", "CC0001", "none", c("status", "error_code", "system_error"), df= TRUE))}
  ## se CAR informado contém número correto de caracteres, programa continua para próxima etapa
  if (grepl("-", fcar)==TRUE) {id.car= fcar}
  if (grepl("-", fcar)==FALSE) {id.car= paste0(substr(fcar, start=1, stop=2), "-", substr(fcar, start=3, stop=9), "-", substr(fcar, start=10, stop=41))}
  
  # identificar município
  codigo_municipio= substr(id.car, start=4, stop=10)
  
  # farmbiomas
  ## upload das fazendas do município (CC0002: erro importação do shapefile -- e.g código municipio incorreto, shapefile não encontrado, etc)
  car= tryCatch({upload.shapefile(codigo_municipio, "AREA_IMOVEL", versao_biomas, ano_referencia, verbose= "")},
                error= function(e){
                  
                  # apagar repositorio temporário dos dados da fazenda 
                  unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
                  
                  # retorna string erros
                  return(coletor.erros("error", "CC0002", e, c("status", "error_code", "system_error"), df= FALSE))
                  })
  
  # se car for da classe lista, interromper programa
  if (class(car)=="list"){return(data.frame(car))}
  
  ## separar shapefile da fazenda (CC0003: erro ao filtrar o CAR do shapefile -- e.g. CAR não encontrado no SisCAR [pode estar regitrado em outro municipio])
  fazenda= tryCatch({car[car$COD_IMOVEL==id.car,]}, error= function(e){{
    
    # apagar repositorio temporário dos dados da fazenda 
    unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
    
    return(coletor.erros("error", "CC0003", e, c("status", "error_code", "system_error"), df= FALSE))
    }})
  
  # se fazenda for da classe lista, interromper programa
  if (class(fazenda)=="list"){return(data.frame(fazenda))}
  
  # se fazenda possuir dimensão zero (nenhuma linha), interromper programa (CC00004: CAR não encontro [objeto filtro tem dimensão zero] -- similar ao erro CC0003)
  if (dim(fazenda)[1]==0){return(coletor.erros("error", "CC0004", "none", c("status", "error_code", "system_error"), df= FALSE))}

  # se fazenda for da classe lista, interromper programa
  if (class(fazenda)=="list"){return(data.frame(fazenda))}
  
  # upload farmmapbiomas (CC0005: erro ao importar bioma completo -- e.g. arquivo não existe, arquivo corrompido, etc)
  farmbiomas= tryCatch({bioma.completo(id.car, fazenda, ano_referencia, versao_biomas, codigo_municipio, "", geoJson)},
                       error= function(e){
                         
                         # apagar repositorio temporário dos dados da fazenda 
                         unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
                         
                         return(coletor.erros("error", "CC0005", e, c("status", "error_code", "system_error"), df= FALSE))
                         })
  
  # se car for da classe lista, interromper programa
  if (class(farmbiomas)=="list"){return(data.frame(farmbiomas))}
  
  # dataframe coletor
  resultados= set.df()
  
  # dados cabeçalho
  resultados$Ano= ano_referencia
  resultados$CAR= id.car
  resultados$Status= "Shapefiles processados."
  
  # dados originários dos shapefiles do CAR
  resultados$SITUACAO= tryCatch(fazenda$SITUACAO, error= function(e){return(NaN)})
  resultados$CONDICAO= tryCatch(fazenda$CONDICAO_I, error= function(e){return(NaN)})
  
  # campos calculados (PS: tryCatch dentro da Calculadora)
  ## resultados= calculadora(resultados, farmbiomas, "Area_Fazenda")
  resultados$Area_Fazenda_Total= calculadora(farmbiomas, vtype= "fazenda")
  resultados$Area_Fazenda_Florestada= calculadora(farmbiomas, vtype= "floresta")

  # campos calculados para cada área da fazenda
  ## Atenção:
  ### Se houver um problema nos shapefiles que delimitam as sub-áreas da fazenda, programa não efetua cálculo dos campos (tryCatch simplesmente irá pular essa sub-área)
  ### Se houver um problema no cálculo do campo (i.e., shapefiles existem e foram feitos uploads), programa irá atribuir "nan" aos campos que não puderam ser calculados
  resultados= biomas.parcial("APP", farmbiomas, id.car, resultados, codigo_municipio, versao_biomas, ano_referencia, "", geoJson)
  resultados= biomas.parcial("RESERVA_LEGAL", farmbiomas, id.car, resultados, codigo_municipio, versao_biomas, ano_referencia, "", geoJson)
  resultados= biomas.parcial("VEGETACAO_NATIVA", farmbiomas, id.car, resultados, codigo_municipio, versao_biomas, ano_referencia, "", geoJson)
  resultados= biomas.parcial("SERVIDAO_ADMINISTRATIVA", farmbiomas, id.car, resultados, codigo_municipio, versao_biomas, ano_referencia, "", geoJson)
  resultados= biomas.parcial("USO_RESTRITO", farmbiomas, id.car, resultados, codigo_municipio, versao_biomas, ano_referencia, "", geoJson)
  resultados= biomas.parcial("AREA_CONSOLIDADA", farmbiomas, id.car, resultados, codigo_municipio, versao_biomas, ano_referencia, "", geoJson)
  
  # atualizar coletor
  resultados$Status= "Shapefile SiCAR Processado"
  
  # salvar arquivo na pasta como csv
  write.csv(resultados, paste0(caminhos("principal-output-csv", versao_biomas, ano_referencia, codigo_municipio), id.car, ".csv"))
  
  # salvar arquivo na pasta como json  
  resultados_json= toJSON(resultados)
  write(resultados_json, paste0(caminhos("principal-output-json", versao_biomas, ano_referencia, codigo_municipio), id.car, ".json"))
  
  # apagar repositorio temporário dos dados da fazenda
  unlink(caminhos("zip-output-temporario", versao_biomas, ano_referencia, codigo_municipio), recursive = TRUE)
  
  return(coletor.erros("code complete", "none", "none", c("status", "error_code", "system_error"), df= TRUE))
  
  }
 
## print('running busCAR')   
## busCAR("-22.050656824840956", "-47.96190036699626", "2020", "v07")
## print('running ConsultaCAR')
## ConsultaCAR("SP354890613CBFC3115AD49A9B51FC014A701B019", "2020", "v07", TRUE)  
## print('The End') 


##########################################################################################
# Fim
##########################################################################################
