 
# upload packages and functions
source('/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR-Dinamizada.R') 

# set folder to call the list of cars
wd= '/mnt/volume_sfo3_01/suporte/coopecredi/' 

# set car vector
cars.list= read.csv(paste0(wd, 'car_list.csv'))
cars.list= as.data.frame(cars.list['fcar'])

# basic objects
ano_referencia= "2022"
versao_biomas= "v08"
geoJson= TRUE

# run loop
for (car in cars.list$fcar)
{
  # status
  print(paste0("Processing CAR: ", car))
  
  # set car number object
  fcar= car
  
  # run functions
  dinamizar(fcar, ano_referencia, versao_biomas)
  print(paste0("Successfully processed: ", car))
  
}

