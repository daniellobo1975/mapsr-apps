export var statusQueryReport;
(function (statusQueryReport) {
    statusQueryReport["recebida"] = "Consulta recebida";
    statusQueryReport["processamento"] = "Consulta em Processamento";
    statusQueryReport["concluida"] = "Consulta Conclu\u00EDda";
    //Problemas processamento
    statusQueryReport["itens_faltando"] = "consulta N\u00C3O CONCLU\u00CDDA - ITENS FALTANDO";
    statusQueryReport["erro_arquivos"] = "consulta N\u00C3O CONCLU\u00CDDA - PROBLEMAS PROCESSAMENTO";
})(statusQueryReport || (statusQueryReport = {}));
// export enum statusQueryReport {
//   'Consulta recebida' = 1,
//   'Consulta em Processamento' = 2,
//   'Consulta Concluída' = 3,
//   //Problemas processamento
//   'consulta NÃO CONCLUÍDA - ITENS FALTANDO' = 4,
//   'consulta NÃO CONCLUÍDA - PROBLEMAS PROCESSAMENTO' = 5
// }
