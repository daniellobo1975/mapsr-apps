x = function(NomeConsulta, AnoInicial, AnoFinal) {  
  
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
  inicio = AnoInicial
  fim= AnoFinal
  
  # principais caminhos
  root= "/mnt/volume_mapsr_11may22/"
  saida = paste0(root,"consulta/", arquivo, "/")
  
  # base final (dataframe coletor)
  consolidado= data.frame()
  
  # periodo da analise
  periodo= as.numeric(AnoInicial):as.numeric(AnoFinal)

  # shapefile fora do Brasil para cruzar com arquivos vazios
  empty_file= paste0(root, "suporte/Luxembourg_shapefile/lu_100km.shp")
    
  # loop temporal
  for(t in periodo)
  {
    
    print("iniciando loop")
    
    # iniciar contador
    n = 0
    
    print("base de dados do CAR")
    
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
      
      print("apagando shapefiles")

      # apagar eventuais shapefiles utilizados
      unlink(paste0(saida, "APP"), recursive = TRUE)
      unlink(paste0(saida, "AREA_IMOVEL"), recursive = TRUE)
      unlink(paste0(saida, "RESERVA_LEGAL"), recursive = TRUE)
      unlink(paste0(saida, "VEGETACAO_NATIVA"), recursive = TRUE)
      unlink(paste0(saida, "SERVIDAO_ADMINISTRATIVA"), recursive = TRUE)
      unlink(paste0(saida, "USO_RESTRITO"), recursive = TRUE)
      unlink(paste0(saida, "AREA_CONSOLIDADA"), recursive = TRUE)
      unlink(paste0(saida, "TEMP"), recursive = TRUE)
      
      # criar nova pasta para com os shapefiles
      dir.create(path= paste0(saida, "AREA_IMOVEL"))
      dir.create(path= paste0(saida, "APP"))
      dir.create(path= paste0(saida, "RESERVA_LEGAL"))
      dir.create(path= paste0(saida, "VEGETACAO_NATIVA"))
      dir.create(path= paste0(saida, "SERVIDAO_ADMINISTRATIVA"))
      dir.create(path= paste0(saida, "USO_RESTRITO"))
      dir.create(path= paste0(saida, "AREA_CONSOLIDADA"))
      dir.create(path= paste0(saida, "TEMP"))
      
      # extrair os arquivos para as pastas locais
      unzip(paste0(root, "sicar-scraper/downloads/2022/SHAPE_", cars[n, "munic"], ".zip"), exdir= paste0(saida, "TEMP"))
      unzip(paste0(saida, "TEMP/", "AREA_IMOVEL.zip"), exdir= paste0(saida, "AREA_IMOVEL"))
      unzip(paste0(saida, "TEMP/", "APP.zip"), exdir= paste0(saida, "APP"))
      unzip(paste0(saida, "TEMP/", "RESERVA_LEGAL.zip"), exdir= paste0(saida, "RESERVA_LEGAL"))
      unzip(paste0(saida, "TEMP/", "VEGETACAO_NATIVA.zip"), exdir= paste0(saida, "VEGETACAO_NATIVA"))
      unzip(paste0(saida, "TEMP/", "SERVIDAO_ADMINISTRATIVA.zip"), exdir= paste0(saida, "SERVIDAO_ADMINISTRATIVA"))
      unzip(paste0(saida, "TEMP/", "USO_RESTRITO.zip"), exdir= paste0(saida, "USO_RESTRITO"))
      unzip(paste0(saida, "TEMP/", "AREA_CONSOLIDADA.zip"), exdir= paste0(saida, "AREA_CONSOLIDADA"))
      
      # definir caminho com o shapefile
	file_car= ifelse(file.exists(paste0(saida, "AREA_IMOVEL/AREA_IMOVEL.shp"))==TRUE, paste0(saida, "AREA_IMOVEL/AREA_IMOVEL.shp"), empty_file)
	file_app= ifelse(file.exists(paste0(saida, "APP/APP.shp"))==TRUE,  paste0(saida, "APP/APP.shp"), empty_file)
	file_rl= ifelse(file.exists(paste0(saida, "RESERVA_LEGAL/RESERVA_LEGAL.shp"))==TRUE, paste0(saida, "RESERVA_LEGAL/RESERVA_LEGAL.shp"), empty_file)
	file_vn= ifelse(file.exists(paste0(saida, "VEGETACAO_NATIVA/VEGETACAO_NATIVA.shp"))==TRUE, paste0(saida, "VEGETACAO_NATIVA/VEGETACAO_NATIVA.shp"), empty_file)
	file_sa= ifelse(file.exists(paste0(saida, "SERVIDAO_ADMINISTRATIVA/SERVIDAO_ADMINISTRATIVA.shp"))==TRUE, paste0(saida, "SERVIDAO_ADMINISTRATIVA/SERVIDAO_ADMINISTRATIVA.shp"), empty_file)
	file_ur= ifelse(file.exists(paste0(saida, "USO_RESTRITO/USO_RESTRITO.shp"))==TRUE, paste0(saida, "USO_RESTRITO/USO_RESTRITO.shp"), empty_file)
	file_ac= ifelse(file.exists(paste0(saida, "AREA_CONSOLIDADA/AREA_CONSOLIDADA.shp"))==TRUE, paste0(saida, "AREA_CONSOLIDADA/AREA_CONSOLIDADA.shp"), empty_file)

      #file_car= paste0(saida, "AREA_IMOVEL/AREA_IMOVEL.shp")
      #file_app= paste0(saida, "APP/APP.shp")
      #file_rl= paste0(saida, "RESERVA_LEGAL/RESERVA_LEGAL.shp")
      #file_vn= paste0(saida, "VEGETACAO_NATIVA/VEGETACAO_NATIVA.shp")
      #file_sa= paste0(saida, "SERVIDAO_ADMINISTRATIVA/SERVIDAO_ADMINISTRATIVA.shp")
      #file_ur= paste0(saida, "USO_RESTRITO/USO_RESTRITO.shp")
      #file_ac= paste0(saida, "AREA_CONSOLIDADA/AREA_CONSOLIDADA.shp")      
      
      # importar mapbiomas
      if(t==2008){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2008-0000000000-0000000000.tif")}
      if(t==2009){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2009-0000000000-0000000000.tif")}
      if(t==2010){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2010-0000000000-0000000000.tif")}
      if(t==2011){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2011-0000000000-0000000000.tif")}
      if(t==2012){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2012-0000000000-0000000000.tif")}
      if(t==2013){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2013-0000000000-0000000000.tif")}
      if(t==2014){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2014-0000000000-0000000000.tif")}
      if(t==2015){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2015-0000000000-0000000000.tif")}
      if(t==2016){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2016-0000000000-0000000000.tif")}
      if(t==2017){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2017-0000000000-0000000000.tif")}
      if(t==2018){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2018-0000000000-0000000000.tif")}
      if(t==2019){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2019-0000000000-0000000000.tif")}
      if(t==2020){file_tif= paste0(root, "bioma/mapbiomas-brazil-collection-60-brasil-2020-0000000000-0000000000.tif")}
      
      # baixar arquivos
      car= st_read(file_car)
      app= st_read(file_app)
      rl= st_read(file_rl)
      vn= st_read(file_vn)
      sa= st_read(file_sa)
      ur= st_read(file_ur)
      ac= st_read(file_ac)
      
      # manter somente uma fazenda no car
      farm= car[car$COD_IMOVEL==fcar,]
      
      # manter somente campos necessários
      app= app["geometry"]
      rl= rl["geometry"]
      vn= vn["geometry"]
      sa= sa["geometry"]
      ur= ur["geometry"]
      ac= ac["geometry"]
      
      
      # ajustar projeção dos CARs
      car= st_transform(car, 4326)
      farm= st_transform(farm, 4326)
      app= st_transform(app, 4326)
      rl= st_transform(rl, 4326)
      vn= st_transform(vn, 4326)
      sa= st_transform(sa, 4326)
      ur= st_transform(ur, 4326)
      ac= st_transform(ac, 4326)
      

      # pré-importação do mapbiomas
      tif= read_stars(file_tif) %>% st_crop(st_bbox(farm))

      # importar mapbiomas
      mapbiomas=st_as_sf(tif)

      # ajustar projeção (desabilitado: não é mais necessária nessa versão)
      # mapbiomas= st_transform(mapbiomas, crs= st_crs(farm))
      # mapbiomas= st_transform(mapbiomas, crs= 4326)

      # renomear campo principal
      colnames(mapbiomas)[1]= "bioma_code" 
      
      # remover objectos usados
      remove(tif)
      
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

      # areas declaradas
      appfarm= st_intersection(x= app, y= farm)
      rlfarm= st_intersection(x= rl, y= farm)
      vnfarm= st_intersection(x= vn, y= farm)
      safarm= st_intersection(x= sa, y= farm)
      urfarm= st_intersection(x= ur, y= farm)
      acfarm= st_intersection(x= ac, y= farm)

      # adicionar as interseccoes
      

      # intersecção com biomas
      farmbiomas= st_intersection(x= farm, y= mapbiomas)
      appfarmbiomas= st_intersection(x= appfarm, y= farmbiomas)
      rlfarmbiomas= st_intersection(x= rlfarm, y= farmbiomas)
      vnfarmbiomas= st_intersection(x= vnfarm, y= farmbiomas)
      safarmbiomas= st_intersection(x= safarm, y= farmbiomas)
      urfarmbiomas= st_intersection(x= urfarm, y= farmbiomas)
      acfarmbiomas= st_intersection(x= acfarm, y= farmbiomas)
      
      
      # Colocar sobreposicao de APP e RL
      sobreposicao_app_rl= st_intersection(x= appfarm, y= rlfarm["geometry"])
      ##  cultivo= st_difference(x= farmbiomas, y= st_union(vnfarm))
      
      # remover objetos usados
      remove(mapbiomas, legenda, app, rl, vn, sa, ur, ac)
      
      # set dataframe
      df= data.frame("", "", "", "",  "", "",
                     "", "", "", "",  "", "",
                     "", "", "", "",  "", "",
                     "", "", "", "",  "", "",
                     "", "", "", "",
                     "", "", "", "",
                     "", "", "", "")
      
      # name columns
      names(df)= c("Ano", "CAR",
                   "Area_Fazenda_CAR", "Area_Fazenda_Florestada", "Area_Fazenda_Florestada_Perc",
                   "Area_Cutivo_CAR", "Area_Cutivo_Florestada", "Area_Cutivo_Florestada_Perc",
                   "Area_APP_CAR", "Area_APP_Florestada", "Area_APP_Deficit", "Area_APP_Deficit_Per", 
                   "Area_RL_CAR", "Area_RL_Florestada", "Area_RL_Deficit", "Area_RL_Deficit_Per", 
                   "Area_VN_CAR", "Area_VN_Florestada", "Area_VN_Deficit", "Area_VN_Deficit_Per", 
                   "Area_Sobreposicao_CAR", "Area_Sobreposicao_Florestada", "Area_Sobreposicao_Deficit", "Area_Sobreposicao_Deficit_Per",
                   "Area_SA_CAR", "Area_SA_Florestada", "Area_SA_Deficit", "Area_SA_Deficit_Per",
                   "Area_UR_CAR", "Area_UR_Florestada", "Area_UR_Deficit", "Area_UR_Deficit_Per", 
                   "Area_AC_CAR", "Area_AC_Florestada", "Area_AC_Deficit", "Area_AC_Deficit_Per")
      
      
      # preencher os campos da base de dados
      
      ## dados iniciais
      df$Ano= t
      df$CAR= fcar
      
      ## Fazenda
      df$Area_Fazenda_CAR= as.numeric(sum(st_area(farm, na.rm=TRUE)))/10000
      df$Area_Fazenda_Florestada= as.numeric(sum(st_area(farmbiomas, na.rm=TRUE)))/10000
      df$Area_Fazenda_Florestada_Perc= (df$Area_Fazenda_Florestada / df$Area_Fazenda_CAR) * 100
 
      ## Area Cultivo (por enquanto só apagando esses campos)
      # df$Area_Cutivo_CAR= as.numeric(sum(st_area(cultivo, na.rm=TRUE)))/10000
      # df$Area_Cutivo_Florestada= as.numeric(sum(st_area(cultivo[cultivo$Legenda== "Area Florestada",], na.rm=TRUE)))/10000
      # df$Area_Cutivo_Florestada_Perc= (df$Area_Cutivo_Florestada / df$Area_Cutivo_CAR) * 100
      df$Area_Cutivo_CAR= NULL
      df$Area_Cutivo_Florestada= NULL
      df$Area_Cutivo_Florestada_Perc= NULL           

      ## APP
      df$Area_APP_CAR= as.numeric(sum(st_area(appfarm, na.rm=TRUE))/10000)
      df$Area_APP_Florestada= as.numeric(sum(st_area(appfarmbiomas, na.rm=TRUE))/10000)
      df$Area_APP_Deficit= df$Area_APP_Florestada - df$Area_APP_CAR
      df$Area_APP_Deficit_Per= (df$Area_APP_Deficit / df$Area_APP_CAR) * 100
      
      ## RL
      df$Area_RL_CAR= as.numeric(sum(st_area(rlfarm, na.rm=TRUE)))/10000
      df$Area_RL_Florestada= as.numeric(sum(st_area(rlfarmbiomas, na.rm=TRUE)))/10000
      df$Area_RL_Deficit= df$Area_RL_Florestada - df$Area_RL_CAR
      df$Area_RL_Deficit_Per= (df$Area_RL_Deficit / df$Area_RL_CAR) * 100     
      
      ## VN
      df$Area_VN_CAR= as.numeric(sum(st_area(vnfarm, na.rm=TRUE)))/10000
      df$Area_VN_Florestada= as.numeric(sum(st_area(vnfarmbiomas, na.rm=TRUE)))/10000
      df$Area_VN_Deficit= df$Area_VN_Florestada - df$Area_VN_CAR
      df$Area_VN_Deficit_Per= (df$Area_VN_Deficit / df$Area_VN_CAR) * 100   
      
      ## Sobreposição RL e RN
      # df$Area_Sobreposicao_CAR=  as.numeric(sum(st_area(sobreposicao, na.rm=TRUE)))/10000
      # df$Area_Sobreposicao_Florestada= as.numeric(sum(st_area(sobreposicao[sobreposicao$Legenda== "Area Florestada",], na.rm=TRUE)))/10000
      # df$Area_Sobreposicao_Deficit= df$Area_Sobreposicao_Florestada - df$Area_Sobreposicao_CAR
      # df$Area_Sobreposicao_Deficit_Per= (df$Area_Sobreposicao_Deficit / df$Area_Sobreposicao_CAR) * 100
      df$Area_Sobreposicao_CAR= NULL
      df$Area_Sobreposicao_Florestada= NULL
      df$Area_Sobreposicao_Deficit= NULL
      df$Area_Sobreposicao_Deficit_Per= NULL
      
      ## SERVIDAO ADMINISTRATIVA
      df$Area_SA_CAR= as.numeric(sum(st_area(safarm, na.rm=TRUE)))/10000
      df$Area_SA_Florestada= as.numeric(sum(st_area(safarmbiomas, na.rm=TRUE)))/10000
      df$Area_SA_Deficit= df$Area_SA_Florestada - df$Area_SA_CAR
      df$Area_SA_Deficit_Per= (df$Area_SA_Deficit / df$Area_SA_CAR) * 100  
      
      ## USO RESTRITO
      df$Area_UR_CAR= as.numeric(sum(st_area(urfarm, na.rm=TRUE)))/10000
      df$Area_UR_Florestada= as.numeric(sum(st_area(urfarmbiomas, na.rm=TRUE)))/10000
      df$Area_UR_Deficit= df$Area_UR_Florestada - df$Area_UR_CAR
      df$Area_UR_Deficit_Per= (df$Area_UR_Deficit / df$Area_UR_CAR) * 100 
      
      ## AREA CONSOLIDADA
      df$Area_AC_CAR= as.numeric(sum(st_area(acfarm, na.rm=TRUE)))/10000
      df$Area_AC_Florestada= as.numeric(sum(st_area(acfarmbiomas, na.rm=TRUE)))/10000
      df$Area_AC_Deficit= df$Area_AC_Florestada - df$Area_AC_CAR
      df$Area_AC_Deficit_Per= (df$Area_AC_Deficit / df$Area_AC_CAR) * 100 
      
      
      # update consolidado
      consolidado= rbind(consolidado, df)
      
      # output 1: .csv file (main data)
      write.csv2(consolidado, paste0(saida, paste0("consolidado"), ".csv"))
    
      # remover objetos usados
      remove(farmbiomas, appfarm, rlfarm, vnfarm, appfarmbiomas, rlfarmbiomas, vnfarmbiomas, fcar, df)
      
      }
    
    # loop car finalizado
      
    } 
  # loop temporal finalizado

  # apagar eventuais shapefiles utilizados
  unlink(paste0(saida, "APP"), recursive = TRUE)
  unlink(paste0(saida, "AREA_IMOVEL"), recursive = TRUE)
  unlink(paste0(saida, "RL"), recursive = TRUE)
  unlink(paste0(saida, "VN"), recursive = TRUE)
  unlink(paste0(saida, "SERVIDAO"), recursive = TRUE)
  unlink(paste0(saida, "UR"), recursive = TRUE)
  unlink(paste0(saida, "AC"), recursive = TRUE)
  unlink(paste0(saida, "TEMP"), recursive = TRUE)

  
  rm(list=ls())
    
  }
