# Last update: March, 24th, 2023
# Author: Thiago Lobo


library(sf, warn.conflicts = F, quietly = T)
library(sp, warn.conflicts = F, quietly = T)
library(stars, warn.conflicts = F, quietly = T)
library(dplyr, warn.conflicts = F, quietly = T)
library(readxl, warn.conflicts = F, quietly = T)
library(measurements, warn.conflicts = F, quietly = T)
library(tidyr, warn.conflicts = F, quietly = T)
# library(rgeos, warn.conflicts = F, quietly = T)


# fazer intersecções aproximadas
suppressMessages(sf_use_s2(FALSE))



#############
# functions #
#############

# all paths needed to generate output
Paths= function(folder)
{
  if (folder=='biomas') {path= '/mnt/volume_mapsr_11may22/bioma/v07'}
  if (folder=='coopecredi') {path= '/mnt/volume_mapsr_11may22/consulta/coopecredi-2023'}
  if (folder=='sicar-scrapper') {path= '/mnt/volume_mapsr_11may22/sicar-scraper/downloads/2022'}
  if (folder=='unzipped-files') {path= '/mnt/volume_mapsr_11may22/consulta/coopecredi-2023/arquivos'}
  if (folder=='suporte') {path='/mnt/volume_mapsr_11may22/suporte'}
  
  return(path)
}


# unzip SICAR file twice
unZipper=function(munic)
{
  root= Paths('coopecredi')
  
  unlink(paste0(root, "/sicar-temp"), recursive = TRUE)
  
  # folder structure
  dir.create(paste0(root, "/sicar-temp/"))
  dir.create(paste0(root, "/sicar-temp/zip-level-1"))
  dir.create(paste0(root, "/sicar-temp/zip-level-2"))
  dir.create(paste0(root, "/sicar-temp/zip-level-2/APP"))
  dir.create(paste0(root, "/sicar-temp/zip-level-2/IMOVEL"))
  
  # unzip level 1
  unzip(paste0(Paths('sicar-scrapper'), '/SHAPE_',munic, '.zip'),
        exdir = paste0(root, '/sicar-temp/zip-level-1'))
  
  # unzip level 2
  ## APP
  unzip(paste0(root, "/sicar-temp/zip-level-1/APP.zip"),
        exdir = paste0(root, "/sicar-temp/zip-level-2/APP"))
  ## IMOVEL
  unzip(paste0(root, "/sicar-temp/zip-level-1/AREA_IMOVEL.zip"),
        exdir = paste0(root, "/sicar-temp/zip-level-2/IMOVEL"))
  
}


# land use data 
farm.land.use= function(ncar, data.farms, ano.biomas, app.land= FALSE)
{
  # identify the municipality
  munic= substring(ncar, first= 4, last= 10)
  
  # upload AREA IMOVEL SICAR
  farm= st_read(paste0(Paths('coopecredi'), '/sicar-temp/zip-level-2/IMOVEL/AREA_IMOVEL.shp'),
                quiet= TRUE,
                options = "ENCODING=UTF-8")
  
  # keep farm of interest
  farm= subset(farm, farm$COD_IMOVEL== car)
  
  # keep main column
  farm= farm[c("COD_IMOVEL")]
  
  # app land use
  if (app.land==TRUE)
  {
    # upload app
    app= st_read(paste0(Paths('coopecredi'), '/sicar-temp/zip-level-2/APP/APP.shp'),
                 quiet= TRUE,
                 options = "ENCODING=UTF-8")

    # set car number into app file
    app$land= "app"
    
    # set limits
    limits= st_bbox(farm["geometry"])
    
    # crop farm limits ("big square")
    app= st_crop(app, limits)
    
    # summarize
    app= app %>% st_make_valid() %>%  group_by(land)  %>% summarise()
    
    # intersection
    farm.app= st_intersection(farm, app)
  
    # correcting cases with zero dimension
    if (dim(farm.app)[1]!=0)
    {
      # replace object
      farm= farm.app
      
      # compute app area
      farm$app_area_hec= round(as.numeric(st_area(farm$geometry, na.rm=TRUE))/10000, digit= 2)
    }
    
    if (dim(farm.app)[1]==0)
    {
      # compute app area
      farm$app_area_hec= 0
    }
    
  }
  if (app.land==FALSE)
  {
    # correcting cases with zero dimension
    if (dim(farm)[1]!=0)
    {
      
      # compute app area
      farm$farm_area_hec= round(as.numeric(st_area(farm$geometry, na.rm=TRUE))/10000, digit= 2)
    }
    
    if (dim(farm)[1]==0)
    {
      # compute app area
      farm$farm_area_hec= 0
    }
    
  }
  
  
  # set projection the same as Mapbiomas
  farm= st_transform(farm,4326)
  
  # set biomas file
  pasta.biomas= paste0(Paths('biomas'), '/mapbiomas-brazil-collection-70-brasil-', ano.biomas, '-0000000000-0000000000.tif')

  # upload biomas data
  biomas= read_stars(pasta.biomas) %>% st_crop(st_bbox(farm))
  
  # transformando biomas em sf (only if there was an intersection)
  biomas= st_as_sf(biomas)
  
  # renomear campo principal
  colnames(biomas)[1]= "bioma_code" 
  
  # agrupar por codigo do bioma
  biomas= biomas %>%  group_by(bioma_code)  %>% summarise()
  
  # intersection
  farm= st_intersection(farm, biomas)
  
  # upload legendas
  legendas= read_excel(paste0(Paths('suporte'), '/legendas_24102022.xlsx'))

  # keep main columns in legendas
  legendas= legendas[c("bioma_code", "Legenda Detalhada")]
  
  # rename
  names(legendas)= c('bioma_code', 'bioma_name')
  
  # merge legendas with farm 
  farm= merge(farm, legendas, by= "bioma_code")
  
  # compute farm area
  farm$bioma_area= round(as.numeric(st_area(farm$geometry, na.rm=TRUE))/10000, digit= 2)

  # keep main columns 
  if (app.land==TRUE) {farm= farm[c("COD_IMOVEL", "app_area_hec", "bioma_name", "bioma_area")]}
  if (app.land==FALSE){farm= farm[c("COD_IMOVEL", "farm_area_hec", "bioma_name", "bioma_area")]}
  
  # drop geometry
  farm$geometry= NULL

  # Pivot the dataframe to create a pivot table
  df_pivot= pivot_wider(farm, names_from = bioma_name, values_from = bioma_area, values_fill = 0)
  names(df_pivot)[1]= 'fcar'

  # set the collector dataframe
  df= subset(data.farms, data.farms$fcar== car)
  df= df[c("fcar", "uf", "munic")]
  
  # set year
  df$year= ano.biomas

  # set final dataframe
  df= merge(df, df_pivot, by= "fcar")
  
  return(df)
  
}


#############
# Main Code #
#############

# settings
ano.biomas= '2021'
app.land= TRUE
if (app.land==FALSE) {outfile= paste0('coopcredi-landuse-farm-level-', ano.biomas, '.csv')}
if (app.land==TRUE) {outfile=  paste0('coopcredi-landuse-app-level-', ano.biomas, '.csv')}

# set file to loop
car.list= read.csv(paste0(Paths('coopecredi'), '/car_list.csv'), sep = ',')

# drop
car.list$X= NULL

# set collector
farms= data.frame()

# set counter
n=1
 
# run loop
for (car in car.list$fcar)
{

  # print status
  print(paste("#", n, " Processing CAR= ", car))

  # identify municipality
  munic= substring(car, first= 4, last= 10)

  # unzip files
  unZipper(munic)
  
  # temporary land use data
  dtemp= farm.land.use(car, car.list, ano.biomas, app.land)
  
  # combine row
  farms= bind_rows(farms, dtemp)
  
  # remove used objects
  remove(car, dtemp)
  
  # update counter
  n= n + 1
  
  # del used folder
  unlink(paste0(Paths('coopecredi'), "/sicar-temp"), recursive = TRUE)
  
}

# remove used objects
remove(n)

# replace nan with zero
farms[is.na(farms)]= 0

# save
write.csv(farms, paste0(Paths('coopecredi'), '/', outfile))

