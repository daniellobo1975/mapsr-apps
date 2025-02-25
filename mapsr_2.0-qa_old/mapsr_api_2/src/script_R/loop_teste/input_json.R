library(jsonlite)

roda_json= function(x)
{
lista= fromJSON(paste(x))
for (v in lista)
 {
  print("---")
 print(v)
  }
}

# roda_json(x)
