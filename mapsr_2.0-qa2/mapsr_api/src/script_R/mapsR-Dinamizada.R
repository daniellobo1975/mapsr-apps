# Data: 24-10-2023
# Autor: Thiago Lobo
# últimas cinco atualizações (em ordem cronológica):
  # 01. mantido somente os caminhos ativos
  # 02. atualização do caminho do CAR
  # 03. latitude e longitude do centróide das propriedades

# Anotações:
# 1. Potencial Problema: VGN totalmente independentes da APP seriam um problema?


##########################################################################################
# limpar espaço na memória
##########################################################################################
rm(list = ls())

##########################################################################################
# pacotes baixados
##########################################################################################
library(sf, warn.conflicts = F, quietly = T)
library(sp, warn.conflicts = F, quietly = T)
library(stars, warn.conflicts = F, quietly = T)
library(dplyr, warn.conflicts = F, quietly = T)
library(readxl, warn.conflicts = F, quietly = T)
library(measurements, warn.conflicts = F, quietly = T)
library(rjson)
library(mapview)

##########################################################################################
# desabilitar "concavidade"
##########################################################################################
suppressMessages(sf_use_s2(FALSE))

##########################################################################################
# Funções compartilhadas com mapsR.R
##########################################################################################
caminhos= function(tipo, versao_biomas, ano_referencia, codigo_municipio)
{
  # descrição: unificar todos os caminhos (pastas) utilizadas no ambiente do R.
  
  #  definir raiz do servidor
  base= "/mnt/volume_mapsr_11may22/"
  mnt= "/mnt/volume_sfo3_01/"
  
  # definir pasta
  ## if (tipo == "arquivos-de-suporte") {caminho= paste0(base, "/suporte/")}
  ## if (tipo == "biomas") {caminho= paste0("/mnt/volume_mapsr_11may22/bioma/", versao_biomas, "/")}
  ## if (tipo == "car-por-municipio") {caminho= paste0(base, "/suporte/car-munics/")}
  ## if (tipo == "farm-biomas") {caminho= paste0(base, "/fazendas/", versao_biomas, "/", ano_referencia, "/tif/")}
  if (tipo == "principal-output-tif") {caminho= paste0(base, "fazendas_3002/", versao_biomas, "/", ano_referencia, "/tif/")}
  if (tipo == "principal-output-csv") {caminho= paste0(base, "fazendas_3002/", versao_biomas, "/", ano_referencia, "/csv/")}
  if (tipo == "principal-output-json") {caminho= paste0(base, "fazendas_3002/", versao_biomas, "/", ano_referencia, "/json/")}
  if (tipo == "principal-output-geojson") {caminho= paste0(base, "fazendas_3002/", versao_biomas, "/", ano_referencia, "/geoJson/")}
  ## if (tipo == "raiz-servidor"){caminho= base}
  # if (tipo == "sicar-scraper") {caminho= paste0(base, "/sicar-scraper/downloads/2022/")}
  if (tipo == "sicar-scraper") {caminho= paste0(mnt, "downloads/sicar-scrapper/2023-10-16-Brasil/")}
  if (tipo == "zip-output-temporario") {caminho= paste0(base, "fazendas_3002/", versao_biomas, "/", ano_referencia, "/", codigo_municipio, "/")}
  
  return(caminho)
}

##########################################################################################
# Calculadora das Áreas A1 e A2
## A1: APP faz interseção com VGN e Bioma Desmatado
## A2: APP faz interseção com VGN e Bioma Florestado
## Observação: R1 e R2 ==> A1 e A2
##########################################################################################
dinamizada_A1_A2= function(arquivo.geojson)
{
  ## A1: APP faz interseção com VGN e Bioma Desmatado
  ## A2: APP faz interseção com VGN e Bioma Florestado

  # upload geo dados da fazenda
  fazenda= st_read(arquivo.geojson)
  
  # separar camadas
  app= fazenda %>% subset(fazenda$camada=="APP")
  vgn= fazenda %>% subset(fazenda$camada=="VGN")
  
  # unificar área (ganho de eficiência)
  app.union= st_union(app)
  vgn.union= st_union(vgn)
  
  ## criar A1 e A2 
  a1= app%>% subset(app$Legenda== "Area Nao Florestada") %>% st_intersection(vgn.union) %>% st_make_valid()
  a2= app%>% subset(app$Legenda== "Area Florestada") %>% st_intersection(vgn.union) %>% st_make_valid()
  
  ## atribuindo nome da camada, sub-camada e tipo de dinamizada ("nome da regra")
  if (dim(a1)[1]!=0)
  {
    a1$camada= "DZD"
    a1$sub_camada= "A1"
    a1$Legenda= "Área não florestada em APP/VGN (deficit)"
  }
  if (dim(a2)[1]!=0)
  {
    a2$camada= "DZD"
    a2$sub_camada= "A2"
    a2$Legenda= "Área florestada em APP/VGN" 
  }
  
  # faz um summary para evitar muitas linhas similares
  a1= a1 %>%  group_by(CAR, ano, camada, sub_camada, Legenda, latitude, longitude)  %>% summarise()
  a2= a2 %>%  group_by(CAR, ano, camada, sub_camada, Legenda, latitude, longitude)  %>% summarise()
  
  
  # dropar objetos já usados
  remove(app, app.union, vgn, vgn.union)
  
  # bind nas novas bases
  dinamizada.A1.A2= rbind(a1, a2)
  
  # append (atualização) da base geoJson
  st_write(dinamizada.A1.A2,
            dsn= arquivo.geojson,
            append= TRUE,
            delete_dsn = FALSE,
            quiet= TRUE)

  # limpar memória
  remove(a1, a2, dinamizada.A1.A2, fazenda)
  
}


##########################################################################################
# Calculadora das Áreas A3, A4 e A7
## R3: VGN com contato APP que não é APP e Bioma Desmatado (contígua)
## R4: VGN com contato APP que não é APP e Bioma Florestado (contígua)
## R7: VGN sem contato (não contígua ou ilha) e Bioma Florestada
## Observação: R3 e R4 e R7 ==> A3, A4 e A7
##########################################################################################
dinamizada_A3_A4= function(arquivo.geojson)
{ 
  ## A3: VGN que não é APP e Bioma Desmatado
  ## A4: VGN que não é APP e Bioma Florestado
  
  # upload geo dados da fazenda
  fazenda= st_read(arquivo.geojson)
  
  # separar camadas
  app= fazenda %>% subset(fazenda$camada=="APP")
  vgn= fazenda %>% subset(fazenda$camada=="VGN")

  # unificar área (ganho de eficiência)
  app.union= st_union(app)
  vgn.union= st_union(vgn)

  # separar cada polígono em um linha separada (cast multiplygon object)
  vgn.polygons= st_cast(vgn.union, "POLYGON")
  
  # transformar em simple features
  vgn.polygons= st_as_sf(vgn.polygons)
  
  # ajustar a projeção
  vgn.polygons= st_transform(vgn.polygons, 4326)
  
  # definir poligonos que fazem contato com APP
  vgn.polygons$overlaps=  as.factor(st_overlaps(vgn.polygons, st_union(app), sparse= FALSE))
  
  # filtrar geometrias que fazem contato e que não fazem contato com a APP
  vgn.contato= vgn.polygons %>% subset(vgn.polygons$overlaps=="TRUE")
  vgn.sem.contato= vgn.polygons %>% subset(vgn.polygons$overlaps=="FALSE")
  
  # vgn que não faz intersecção com app
  vgn.diff= st_difference(vgn.contato, app.union)
  
  ## dinamizada áreas A3 e A4 
  a3= vgn%>% subset(vgn$Legenda== "Area Nao Florestada") %>% st_intersection(vgn.diff) %>% st_make_valid()
  a4= vgn%>% subset(vgn$Legenda== "Area Florestada") %>% st_intersection(vgn.diff) %>% st_make_valid()
  
  ## ajustar A3 (somente se dataframe tiver pelo menos 1 linha)
  if (dim(a3)[1]!=0)
  {
    ## dropar colunas usadas
    a3$overlaps= NULL

    # renomear camada
    a3$camada= "DZD" 
    
    # renomear sub_camada
    a3$sub_camada= "A3" 
    
    # renomear legenda
    a3$Legenda= "Area não florestada em VGN contígua a APP"
        
  }
    
  ## ajustar A3
  if (dim(a4)[1]!=0)
  {
    ## dropar colunas usadas
    a4$overlaps= NULL
    
    # renomear camada
    a4$camada= "DZD" 
    
    # renomear sub_camada
    a4$sub_camada= "A4" 
    
    # renomear legenda
    a4$Legenda= "Área florestada em VGN contígua a APP"
    
  }
  
  # faz um summary para evitar muitas linhas similares
  a3= a3 %>%  group_by(CAR, ano, camada, sub_camada, Legenda, latitude, longitude)  %>% summarise()
  a4= a4 %>%  group_by(CAR, ano, sub_camada, camada, Legenda, latitude, longitude)  %>% summarise()
  
  # dropar objectos usados
  remove(app, app.union, vgn, vgn.contato, vgn.diff, vgn.polygons, vgn.sem.contato, vgn.union)
  
  # bind nas novas bases
  dinamizada.A3.A4= rbind(a3, a4)
  
  # append (atualização) da base geoJson
  st_write(dinamizada.A3.A4,
           dsn= arquivo.geojson,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
  
  # limpar memória
  remove(a3, a4, dinamizada.A3.A4, fazenda)
  
}

dinamizada_A7= function(arquivo.geojson)
{
  ## A7
  
  # upload geo dados da fazenda
  fazenda= st_read(arquivo.geojson)
  
  # separar camadas
  app= fazenda %>% subset(fazenda$camada=="APP")
  vgn= fazenda %>% subset(fazenda$camada=="VGN")
  
  # unificar área (ganho de eficiência)
  app.union= st_union(app)
  vgn.union= st_union(vgn)
  
  # separar cada polígono em um linha separada (cast multiplygon object)
  vgn.polygons= st_cast(vgn.union, "POLYGON")
  
  # transformar em simple features
  vgn.polygons= st_as_sf(vgn.polygons)
  
  # ajustar a projeção
  vgn.polygons= st_transform(vgn.polygons, 4326)
  
  # definir poligonos que fazem contato com APP
  vgn.polygons$overlaps=  as.factor(st_overlaps(vgn.polygons, st_union(app), sparse= FALSE))
  
  # filtrar geometrias que fazem contato e que não fazem contato com a APP
  vgn.contato= vgn.polygons %>% subset(vgn.polygons$overlaps=="TRUE")
  vgn.sem.contato= vgn.polygons %>% subset(vgn.polygons$overlaps=="FALSE")
  
  # vgn que não faz intersecção com app
  vgn.diff= st_difference(vgn.contato, app.union)
  
  ## dinamizada áreas A7 
  dinamizada.a7= vgn%>% subset(vgn$Legenda== "Area Florestada") %>% st_intersection(vgn.sem.contato) %>% st_make_valid()
  
  if (dim(dinamizada.a7)[1]!=0)
  {
    ## dropar colunas usadas
    dinamizada.a7$overlaps= NULL
    
    # renomear camada
    dinamizada.a7$camada= "DZD" 
    
    # renomear subcamada 
    dinamizada.a7$sub_camada= "A7"
    
    # renomear legenda
    dinamizada.a7$Legenda= "Área florestada VGN não contígua a APP (excedente)"
  }
  

  # faz um summary para evitar muitas linhas similares
  dinamizada.a7= dinamizada.a7 %>%  group_by(CAR, ano, camada, sub_camada, Legenda, latitude, longitude)  %>% summarise()
      
  # dropar objectos usados
  remove(app, app.union, vgn, vgn.contato, vgn.diff, vgn.polygons, vgn.sem.contato, vgn.union)
  
  # append (atualização) da base geoJson
  st_write(dinamizada.a7,
           dsn= arquivo.geojson,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
  
  # limpar memória
  remove(dinamizada.a7, fazenda, arquivo.geojson)
  
}


##########################################################################################
# Calculadora das Áreas A5 e A6
## R5: APP que não é VGN e Bioma Desmatado ==> Precisa ser Compensado [!]
## R6: APP que não é VGN e Bioma Florestado ==> "Entra simplesmente como APP"
## Observação: R5 e R6 ==> A5 e A6
##########################################################################################
dinamizada_A5_A6= function(arquivo.geojson)
{
  ## A5: APP faz interseção com VGN e Bioma Desmatado
  ## A6: APP faz interseção com VGN e Bioma Florestado
  
  # upload geo dados da fazenda
  fazenda= st_read(arquivo.geojson)
  
  # separar camadas
  app= fazenda %>% subset(fazenda$camada=="APP")
  vgn= fazenda %>% subset(fazenda$camada=="VGN")
  
  # unificar área (ganho de eficiência)
  app.union= st_union(app)
  vgn.union= st_union(vgn)
  
  # calcular áreas que são app e não são vgn (diferença simples)
  app.dif= st_difference(app.union, vgn.union)
  
  ## criar R5 e R6 
  a5= app%>% subset(app$Legenda== "Area Nao Florestada") %>% st_intersection(app.dif) %>% st_make_valid()
  a6= app%>% subset(app$Legenda== "Area Florestada") %>% st_intersection(app.dif) %>% st_make_valid()
  
  if (dim(a5)[1]!=0)
  {
    # atualizar camada
    a5$camada= "DZD" 
    
    # atualizar sub-camada
    a5$sub_camada= "A5"
    
    # atualizar Legenda
    a5$Legenda= "Área não florestada em APP (compensar)"
    
  }
  
  if (dim(a6)[1]!=0)
  {
    # atualizar camada
    a6$camada= "DZD" 

    # atualizar sub-camada
    a6$sub_camada= "A6"
        
    # atualizar Legenda
    a6$Legenda= "Área florestada em APP"
    
  }
  
  
  # faz um summary para evitar muitas linhas similares
  a5= a5 %>%  group_by(CAR, ano, camada, sub_camada, Legenda, latitude, longitude)  %>% summarise()
  a6= a6 %>%  group_by(CAR, ano, camada, sub_camada, Legenda, latitude, longitude)  %>% summarise()
  
  
  # dropar objetos já usados
  remove(app, app.union, vgn, vgn.union, app.dif)
  
  # bind nas novas bases
  dinamizada.A5.A6= rbind(a5, a6)
  
  # append (atualização) da base geoJson
  st_write(dinamizada.A5.A6,
           dsn= arquivo.geojson,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
  
  # limpar memória
  remove(a5, a6, dinamizada.A5.A6, fazenda, arquivo.geojson)

}


##########################################################################################
# Visão Desmatador e 1a parte da Visão Consolidada
##########################################################################################
dinamizada_desmatador= function(arquivo.geojson)
{
  # Calcula gráfico desmatador
  
  # upload geo dados da fazenda
  fazenda= st_read(arquivo.geojson)
  
  ## Visão Desmatador
  a1= fazenda %>% subset(fazenda$camada== "DZD" & fazenda$sub_camada== "A1")
  a5= fazenda %>% subset(fazenda$camada== "DZD" & fazenda$sub_camada== "A5")
  
  
  ## susbstituir nome da camada antiga
  if (dim(a1)[1]!=0)
  {
    # atualizar sub-camada
    a1$sub_camada= "V11"
  }
   
  if (dim(a5)[1]!=0)
  {
    # atualizar sub-camada
    a5$sub_camada= "V12"
  }
   
  # juntar bases
  desmatador= rbind(a1, a5)
  
  if (dim(desmatador)[1]!=0)
  {
    # atualizar camada
    desmatador$camada= "VIS1"
  }
  
  # parte 1: append (atualização) da base geoJson visão desmatador
  st_write(desmatador,
           dsn= arquivo.geojson,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
  
  # visão 3
  
  # retirar área a compensar
  desmatador= desmatador %>% subset(desmatador$sub_camada!="V12")
  
  if (dim(desmatador)[1]!=0)
  {
    # renomear camda
    desmatador$camada= "VIS3"
    
    # renomear sub_camda
    desmatador$sub_camada= "V31"
    
    # renomear Legenda
    desmatador$Legenda= "Área Não Florestada"
  }
  
  # agrupar 
  desmatador= desmatador %>%  group_by(CAR, ano, camada, sub_camada, Legenda, latitude, longitude)  %>% summarise()
  
  # parte 2: append (atualização) da base geoJson visão desmatador "gerencial"
  st_write(desmatador,
           dsn= arquivo.geojson,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
  
  # limpar memória
  remove(a1, a5, desmatador,fazenda)
}


##########################################################################################
# GeoJson: adicionar polígons da fazenda, app, rl e vgn
##########################################################################################
adicionar_perimetro= function(arquivo.geojson, cmd, cmd_novo, sub_cmd_novo, legenda_novo)
{
  # Cria linha com a nova camada e faz um append no arquivo salvo
  
  # upload geo dados da fazenda
  fazenda= st_read(arquivo.geojson)
  
  # separando a nova linha
  linha= fazenda %>% subset(fazenda$camada==cmd)
  
  # atribuindo novos valores às camadas, sub-camadas e legenda
  linha$geometry= NULL
  linha$camada= cmd_novo
  linha$sub_camada= sub_cmd_novo
  linha$Legenda= legenda_novo
  
  # sumarizando para uma única linha
  linha= linha %>% group_by(CAR, ano, camada, sub_camada, Legenda, latitude, longitude)  %>% summarise() 
  
  # obtendo o polígono da área
  perimetro= fazenda %>% subset(fazenda$camada==cmd) %>% st_union() %>% st_as_sf() %>% st_transform(crs=4326) 
  
  # adicionando à nova linha
  linha$geometry= st_geometry(perimetro)
  
  # transformando em simple features
  linha= linha %>% st_as_sf()
  
  # append (atualização) da base geoJson
  st_write(linha,
           dsn= arquivo.geojson,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
  
  # remover objetos usados
  remove(perimetro, linha)
  
}


##########################################################################################
# Visão Preservador e 2a parte da Visão Consolidada
##########################################################################################
dinamizada_preservador= function(arquivo.geojson)
{
  # Calcula gráfico desmatador
  
  # upload geo dados da fazenda
  fazenda= st_read(arquivo.geojson)
  
  # Visão Preservador
  a2= fazenda %>% subset(fazenda$camada== "DZD" & fazenda$sub_camada== "A2")
  a4= fazenda %>% subset(fazenda$camada== "DZD" & fazenda$sub_camada== "A4")
  a6= fazenda %>% subset(fazenda$camada== "DZD" & fazenda$sub_camada== "A6")
  
  ## susbstituir nome da camada antiga
  if (dim(a2)[1]!=0)
  {
    # atualizar sub-camada
    a2$sub_camada= "V21"
  }
  
  ## susbstituir nome da camada antiga
  if (dim(a4)[1]!=0)
  {
    # atualizar sub-camada
    a4$sub_camada= "V22"
  }
  
  ## atualizar nome da camada
  if (dim(a6)[1]!=0)
  {
    a6$sub_camada= "V23"
  }
  
  
  # visão preservador
  preservador= rbind(a2, a4, a6)
  
  ## atualizar nome da camada
  if (dim(preservador)[1]!=0)
  {
    preservador$camada= "VIS2"  
  }
  
  # append (atualização) da base geoJson
  st_write(preservador,
           dsn= arquivo.geojson,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
  
  # visão 3
  
  ## atualizar
  if (dim(preservador)[1]!=0)
  {
    # camada
    preservador$camada= "VIS3"
    
    # sub-camada
    preservador$sub_camada= "V32"
    
    # legenda 
    preservador$Legenda= "Área Florestada"

  }
  
  ## agrupar 
  preservador= preservador %>%  group_by(CAR, ano, camada, sub_camada, Legenda, latitude, longitude)  %>% summarise()
  
  # parte 2: append (atualização) da base geoJson visão preservador "gerencial"
  st_write(preservador,
           dsn= arquivo.geojson,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
  
  # remover objetos usados
  remove(a2, a4, a6, fazenda, preservador)
  
}




##########################################################################################
# Atualizar json e csv
##########################################################################################
# fórmula
calcular_area_dinamizada= function(base, poligono, tipo, sub_tipo, vname)
{
  # separar area
  area= poligono %>% subset(poligono$camada== tipo & poligono$sub_camada== sub_tipo)
  
  # calcular area
  base$temp = try(round(as.numeric(sum(st_area(area, na.rm=TRUE)))/10000, digit= 2), silent= TRUE)
  
  # renomear
  names(base)[which(colnames(base)=="temp")]= vname
  
  return(base)
}

# calcular centroide da fazenda
calcular_centroide= function(base, poligono)
{
  
  # filtrar propriedade
  farm= poligono %>% subset(poligono$camada== "FZD")
  
  # criar único bloco da fazenda
  farm_union= st_union(farm)
  
  # calcular o centróide
  farm_centroid = st_centroid(farm_union)
  
  # extrair coordenadas do centróide
  centroid_coords = st_coordinates(farm_centroid) 
  
  base$cent_log= centroid_coords[1]
  base$cent_lat= centroid_coords[2]
  
  return(base)
}


# rotina de cálculo de todas as áreas
atualizar_areas_dinamizadas= function(arquivo.csv, arquivo.json, arquivo.geojson)
{
  # fazer upload do csv e json
  dcsv= read.csv(arquivo.csv, row.names=1) 
  djson= fromJSON(file = arquivo.json)
  djson= as.data.frame(djson)
  
  # upload geo dados da fazenda
  fazenda= st_read(arquivo.geojson) 
  
  # calcular áreas individuais no csv
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "DZD", "A1", "A1")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "DZD", "A2", "A2")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "DZD", "A3", "A3")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "DZD", "A4", "A4")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "DZD", "A5", "A5")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "DZD", "A6", "A6")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "DZD", "A7", "A7")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "VIS1", "V11", "V11")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "VIS1", "V12", "V12")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "VIS2", "V21", "V21")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "VIS2", "V22", "V22")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "VIS2", "V23", "V23")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "VIS3", "V31", "V31")
  dcsv= calcular_area_dinamizada(dcsv, fazenda, "VIS3", "V32", "V32")
  dcsv= calcular_centroide(dcsv, fazenda)

  
  # calcular areas no json
  djson= calcular_area_dinamizada(djson, fazenda, "DZD", "A1", "A1")
  djson= calcular_area_dinamizada(djson, fazenda, "DZD", "A2", "A2")
  djson= calcular_area_dinamizada(djson, fazenda, "DZD", "A3", "A3")
  djson= calcular_area_dinamizada(djson, fazenda, "DZD", "A4", "A4")
  djson= calcular_area_dinamizada(djson, fazenda, "DZD", "A5", "A5")
  djson= calcular_area_dinamizada(djson, fazenda, "DZD", "A6", "A6")
  djson= calcular_area_dinamizada(djson, fazenda, "DZD", "A7", "A7")
  djson= calcular_area_dinamizada(djson, fazenda, "VIS1", "V11", "V11")
  djson= calcular_area_dinamizada(djson, fazenda, "VIS1", "V12", "V12")
  djson= calcular_area_dinamizada(djson, fazenda, "VIS2", "V21", "V21")
  djson= calcular_area_dinamizada(djson, fazenda, "VIS2", "V22", "V22")
  djson= calcular_area_dinamizada(djson, fazenda, "VIS2", "V23", "V23")
  djson= calcular_area_dinamizada(djson, fazenda, "VIS3", "V31", "V31")
  djson= calcular_area_dinamizada(djson, fazenda, "VIS3", "V32", "V32")

  # csv: salvar arquivo atualizado 
  write.csv(dcsv, arquivo.csv)
  
  # json: salvar arquivoa tualizado
  # salvar arquivo na pasta como json  
  djson= toJSON(djson)
  write(djson, arquivo.json)
  
  # limpar memória
  remove(dcsv, djson, fazenda)
  
}

salvar.geoJson= function(arquivo.geojson, objeto.biomas, nome)
{

  # sempre que rodar uma fazenda arquivo geoJson será deletado ("inicia novo GeoJson") 
  if (nome == "FZD") {unlink(arquivo.geojson)}
  
  # criar arquivo GeoJson (casos diferentes de FZD, o arquivo GeoJson será anexado ao existente)
  st_write(objeto.biomas,
           dsn= arquivo.geojson,
           append= TRUE,
           delete_dsn = FALSE,
           quiet= TRUE)
}


##########################################################################################
# Código Principal
##########################################################################################
dinamizar= function(fcar, ano_referencia, versao_biomas)
{
  
  # id CAR oficial (com separadores)
  ## se CAR informado contém número menor ou igual a 40 caracteres, programa é interrompido (CC0001: CAR informado não está completo)
  if (nchar(fcar)<=40) {return(coletor.erros("error", "CC0001", "none", c("status", "error_code", "system_error"), df= TRUE))}
  ## se CAR informado contém número correto de caracteres, programa continua para próxima etapa
  if (grepl("-", fcar)==TRUE) {id.car= fcar}
  if (grepl("-", fcar)==FALSE) {id.car= paste0(substr(fcar, start=1, stop=2), "-", substr(fcar, start=3, stop=9), "-", substr(fcar, start=10, stop=41))}
  
  
  # caminho para os arquivos
  arquivo.csv= paste0(caminhos("principal-output-csv", versao_biomas, ano_referencia, ""), id.car, ".csv")
  arquivo.json= paste0(caminhos("principal-output-json", versao_biomas, ano_referencia, ""), id.car, ".json")
  arquivo.geojson= paste0(caminhos("principal-output-geojson", versao_biomas, ano_referencia, ""), id.car, ".GeoJSON")
  
  # gerar as áreas dinamizadas (A1 a A7)
  try(dinamizada_A1_A2(arquivo.geojson))
  try(dinamizada_A3_A4(arquivo.geojson))
  try(dinamizada_A5_A6(arquivo.geojson))
  try(dinamizada_A7(arquivo.geojson))
  
  # gerar os perímetros das áreas
  try(adicionar_perimetro(arquivo.geojson, "FZD", "PER", "PER-FZD", "Perímetro da propriedade"))
  try(adicionar_perimetro(arquivo.geojson, "APP", "PER", "PER-APP", "Perímetro da APP"))
  try(adicionar_perimetro(arquivo.geojson, "RLG", "PER", "PER-RLG", "Perímetro da Reserva Legal"))
  try(adicionar_perimetro(arquivo.geojson, "VGN", "PER", "PER-VGN", "Perímetro da Reserva Vegetação Nativa"))
  
  
  # gerar as visões desmatador, preservador e consolidada (v1, v2 e v3)
  dinamizada_desmatador(arquivo.geojson)
  dinamizada_preservador(arquivo.geojson)
  
  # calcular os campos da base csv e json
  atualizar_areas_dinamizadas(arquivo.csv, arquivo.json, arquivo.geojson)
  
}


##########################################################################################
## Código para verificação de erro (somente relativo à última atualização)
## PS: para códigos anteriores, ver versões anteriores no back-up
##########################################################################################
## arquivo.geojson= "/Users/thiagopereiralobo/Documents/GitHub/FarmForest/Code/dev/temp/SP-3543402-5A873C9F8073483AAE8BEF43059F565E.GeoJSON"
## arquivo.csv= "/Users/thiagopereiralobo/Documents/GitHub/FarmForest/Code/dev/temp/SP-3543402-5A873C9F8073483AAE8BEF43059F565E.csv"
## arquivo.json= "/Users/thiagopereiralobo/Documents/GitHub/FarmForest/Code/dev/temp/SP-3543402-5A873C9F8073483AAE8BEF43059F565E.json"
# farm= st_read(arquivo.geojson)
# subset(farm, farm$camada== "PER" ) %>% mapview(zcol= "Legenda")
# subset(farm, farm$camada== "PER" & farm$sub_camada== "FZD") %>% mapview()
# subset(farm, farm$camada== "PER" & farm$sub_camada== "APP") %>% mapview()
# subset(farm, farm$camada== "PER" & farm$sub_camada== "RLG") %>% mapview()
# subset(farm, farm$camada== "PER" & farm$sub_camada== "VGN") %>% mapview()


##########################################################################################
# Fim
##########################################################################################