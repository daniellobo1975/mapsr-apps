module.exports = {
    //essa funcao cria uma pausa na execucao do código
    async sleep(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}