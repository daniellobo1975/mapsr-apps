x = function(NomeConsulta, Ano) {  

  #  pacotes necessarios
  library(abind)
  library(geosphere)
  library(ggplot2)
  library(raster)
  library(sf)
  library(sp)
  library(stars)
  library(rgeos)
  library(readxl)
  
  # objetos
  arquivo = NomeConsulta
  ano = Ano
  
  # principais caminhos
  root= "/mnt/volume_mapsr_11may22/"
  saida = paste0(root,"consulta/", arquivo, "/")

  # iniciar contador
  n = 0
    
  # gerar base com os dados do CAR
  cars= read.csv(paste0(saida, "/cars.csv"))
  cars$uf= substr(cars$NUMREGCAR, start=1, stop=2)
  cars$munic= substr(cars$NUMREGCAR, start=3, stop=9)
  cars$code= substr(cars$NUMREGCAR, start=10, stop=41)
  cars$fcar= paste0(cars$uf, "-", cars$munic, "-", cars$code)
  write.csv2(cars, paste0(saida, "car_list.csv"))
    
  # car loop
  for(fcar in cars$fcar)
    {  
    
    # atualizar contador
    n = n+1
      
    # apagar eventuais shapefiles utilizados
    unlink(paste0(saida, "AREA_IMOVEL"), recursive = TRUE)
    unlink(paste0(saida, "VN"), recursive = TRUE)

    # criar nova pasta para com os shapefiles
    dir.create(path= paste0(saida, "AREA_IMOVEL"))
    dir.create(path= paste0(saida, "VN"))

    # extrair os arquivos para as pastas locais
    unzip(paste0(root, "sicar-scraper/downloads/2022/SHAPE_", cars[n, "munic"], ".zip"), exdir= paste0(saida, "TEMP"))
    unzip(paste0(saida, "TEMP/", "AREA_IMOVEL.zip"), exdir= paste0(saida, "AREA_IMOVEL"))
    unzip(paste0(saida, "TEMP/", "VEGETACAO_NATIVA.zip"), exdir= paste0(saida, "VN"))
      
    # definir caminho com o shapefile
    file_car= paste0(saida, "AREA_IMOVEL/AREA_IMOVEL.shp")
    file_vn= paste0(saida, "VN//VEGETACAO_NATIVA.shp")
      
    # importar mapbiomas
    if(ano==2008){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2008-0000000000-0000000000.tif")}
    if(ano==2009){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2009-0000000000-0000000000.tif")}
    if(ano==2010){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2010-0000000000-0000000000.tif")}
    if(ano==2011){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2011-0000000000-0000000000.tif")}
    if(ano==2012){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2012-0000000000-0000000000.tif")}
    if(ano==2013){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2013-0000000000-0000000000.tif")}
    if(ano==2014){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2014-0000000000-0000000000.tif")}
    if(ano==2015){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2015-0000000000-0000000000.tif")}
    if(ano==2016){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2016-0000000000-0000000000.tif")}
    if(ano==2017){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2017-0000000000-0000000000.tif")}
    if(ano==2018){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2018-0000000000-0000000000.tif")}
    if(ano==2019){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2019-0000000000-0000000000.tif")}
    if(ano==2020){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2020-0000000000-0000000000.tif")}
      
    # baixar arquivos
    car= st_read(file_car)
    vn= st_read(file_vn)
      
    # manter somente uma fazenda no car
    farm= car[car$COD_IMOVEL==fcar,]
      
    # manter somente campos necessários
    vn= vn["geometry"]

    # ajustar projeção dos CARs
    car= st_transform(car, 4326)
    farm= st_transform(farm, 4326)
    vn= st_transform(vn, 4326)
      
    # pré-importação do mapbiomas
    tif= read_stars(file_tif) %>% st_crop(st_bbox(farm))
    
    # importar mapbiomas
    mapbiomas=st_as_sf(tif)
      
    # ajustar projeção (desabilitado: não é mais necessário)
    ## mapbiomas= st_transform(mapbiomas, crs= 4326)
      
    # renomear campo principal
    colnames(mapbiomas)[1]= "bioma_code" 
      
    # remover objectos usados
    remove(tif, temporary)
    
    # ajuste para rodar R (origem: programador Workana)
    sf_use_s2(FALSE)
      
    # baixar legendas do mapbiomas
    legenda= read_excel(paste0(root, "suporte/legendas_26052022.xlsx"))
    
    # adicionar legendas ao arquivo principal
    mapbiomas= merge(x= mapbiomas, y= legenda, by= c("bioma_code"))
    
    # manter somente com area florestada
    mapbiomas= mapbiomas[mapbiomas$Legenda=='Area Florestada',]
    
    # unificar pixels do mapbiomas
    mapbiomas= st_union(mapbiomas)
    
    # intersecção fazenda e biomas
    farmbiomas= st_intersection(x= farm, y= mapbiomas)

    # intersecção fazenda e área fazenda
    vn= st_intersection(x= vn, y= farm)

    # unir geometrias (para gráfico)
    farmU= st_union(farm)
    farmbiomasU= st_union(farmbiomas)
    vnU= st_union(vn)

    # mapas
    ## g1: area da fazenda com e sem floresta
    print("iniciando grafico")
    g1= ggplot() +
      geom_sf(data= farmU, fill= "NA", color= "black", size=0.5)+
      geom_sf(data= vnU, fill= "gray", color= "gray", size=0)+
      geom_sf(data= farmbiomasU, fill= "green", color= "green", size=0.0)+
      labs(title = "Mapa da Fazenda",
           subtitle = paste0("CAR ",fcar, "\n \n Verde: áreas florestadas na fazenda  \n Cinza: APP e RL declarado"),
           caption = "Fonte: LandSat 8 e SICAR") +
      coord_sf(ndiscr = F) +
      theme_void()

    ## salvar arquivos
    ggsave(filename= paste0(saida, ano, "-", "FARM" , "-", fcar, ".pdf"), g1, width = 12, height = 9)

    # remover mapas
    remove(g1)

    # remover objetos usados
    remove(mapbiomas, legenda, app, rl, vn)
      
    # remover objetos usados
    remove(farmbiomas, appfarm, rlfarm, vnfarm, sobreposicao, cultivo, fcar)
      
    }
    
  # loop car finalizado
  
  # apagar as pastas utilizadas
  unlink(paste0(saida, "AREA_IMOVEL"), recursive = TRUE)
  unlink(paste0(saida, "VN"), recursive = TRUE)
  
  rm(list=ls())
  
}

