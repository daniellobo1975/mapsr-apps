# library
library(jsonlite)

loopJson <- function(input_json, input_json_cars) {
  # Converte a string JSON para uma lista em R
  input_list <- fromJSON(input_json)
  input_list_cars <- fromJSON(input_json_cars)
  
  # Faca o que for necessario com as listas
  
  # Exemplo: Inverter a ordem da lista
  ## output_list <- rev(input_list)
  ## output_list_cars <- rev(input_list_cars)
  
  # Imprime o resultado como uma string JSON
  ## print(toJSON(output_list))
  ## print(toJSON(output_list_cars))

  # loop string de anos
  for (ano in input_list)
  {

  # loop no string de cars
  for (car in input_list_cars)
  { 

  # chama script pronto
  source("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR.R")
  ConsultaCAR(fcar= car, ano_referencia= ano, versao_biomas= "v08", geoJson= "TRUE")
  
  source("/mnt/volume_mapsr_11may22/mapsr_2.0/mapsr_api/src/script_R/mapsR-Dinamizada.R")
  dinamizar(fcar= car, ano_referencia= ano, versao_biomas= "v08")  
  
  }  

  }
}

# Verifica se o script estao sendo chamado a partir da linha de comando
if ("loopJson" %in% commandArgs(trailingOnly = TRUE)) {
  # Recebe as strings JSON do Node.js
  jsonString <- commandArgs(trailingOnly = TRUE)[2]
  jsonStringCars <- commandArgs(trailingOnly = TRUE)[3]
  
  # Chama a funcao
  loopJson(jsonString, jsonStringCars)
}


