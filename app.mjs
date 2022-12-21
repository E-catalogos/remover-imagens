import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import inquirer from 'inquirer';

const __dirname = dirname(fileURLToPath(import.meta.url));

const validateParams = (data) => (!data.originDirectory || !data.destinationDirectory || !data.archive_json) ? false : true;
const validatePaths = (data) => {
    // Listando o nome de todos os arquivos no diretório de origem
    let allImages
    try {
        allImages = fs.readdirSync(__dirname + `/${data.originDirectory}`)
    } catch (error) {
        return console.log(chalk.redBright('O diretório de origem informando não existe.\nDiretório:', __dirname + `/${data.originDirectory}`))
    }

    // Leitura do arquivo JSON 
    let usedImages
    try {
        usedImages = JSON.parse(fs.readFileSync(__dirname + `/${data.archive_json}`, "utf-8"))
    } catch (error) {
        return console.log(chalk.redBright('O arquivo .json informado não foi localizado ou não possui conteúdo.\nLocal indicado:', __dirname + `/${data.archive_json}`))
    }

    return { allImages, usedImages }
}

const handleConfirmCommand = async (data) => {
    let confirmCommand
    await inquirer.prompt([
        {
            name: 'confirmOperation',
            message: 'Você deseja realmente mover os arquivos?',
            type: 'confirm',

        },
    ]).then(async (answerOperation) => {
        if (!answerOperation.confirmOperation)
            return console.log(chalk.bgMagentaBright("Operação cancelada."))

        await inquirer.prompt([{
            name: 'confirmPaths',
            message: `Confirme se o diretório de origem e o de destino estão corretos.
            \n- Diretório de origem: "${__dirname + `/${data.originDirectory}`}"\n- Diretório de destino: "${__dirname + `/${data.destinationDirectory}`}"\n- Arquivo JSON: "${__dirname + `/${data.archive_json}}"`}
            \nOs caminhos estão corretos?`,
            type: 'confirm'
        }]).then((answerPaths) => confirmCommand = answerPaths.confirmPaths)
    }).catch((err) => console.log(err))

    return confirmCommand
}

const execute = async (data) => {
    if (!validateParams(data)) return console.log(
        chalk.red(
            `Erro: informe todos os parâmetros.
                \n\n1- Diretório de origem (onde estão todas os arquivos de images);
                \n2- Diretório de destino (local que deseja mover as imagens não utilizadas);
                \n3- Arquivo .json que contém o nome de todas as imagens que estão sendo utilizadas.`
        )
    )

    // Resgatando os diretórios de origem e destino
    const originDirectory = data.originDirectory;
    const destinationDirectory = data.destinationDirectory;

    const { allImages, usedImages } = validatePaths(data) || process.exit(1)

    // Validando se há conteudo nas pastas e no json informado
    if (allImages.length === 0)
        return console.log(chalk.redBright("Não há imagens no diretório informado."));

    if (allImages.length === 0)
        return console.log(chalk.redBright("Não há imagens no arquivo .json informado."));


    // Validando se a operação foi cancelada
    const confirmCommand = await handleConfirmCommand(data)
    if (!confirmCommand) {
        console.log(chalk.bgMagentaBright("Operação cancelada."))
        return process.exit(1)
    }

    // Cetificando que o diretório de origem existe
    !fs.existsSync(__dirname + `/${destinationDirectory}`) && fs.mkdirSync(__dirname + `/${destinationDirectory}`)

    //  Movendo as imagens para o novo diretório
    let countMoveds = 0
    allImages.map((item) => {
        if (usedImages.filter(image => image === item).length > 0) {
            try {
                fs.renameSync(`${__dirname}/${originDirectory}/${item}`, `${__dirname}/${destinationDirectory}/${item}`)
                return countMoveds++;
            } catch (error) {
                console.log(chalk.redBright(`Falha ao mover a imagem: ${item}`))
            }
        }
    })

    console.log(chalk.bgGreenBright(`Operação concluída.`))
    console.log(chalk.greenBright(`Foram movidos ${countMoveds} de ${usedImages.length} arquivos.`))
}

console.clear()
console.log(chalk.greenBright("Bem-vindo ao sistema.\nInforme os campos abaixo para prosseguir com a remoção da imagens inutilizadas.\n\nFeito por Thales Santos."))
inquirer.prompt([
    {
        name: 'originDirectory',
        message: 'Diretório de origem: ',
        type: 'input'
    },
    {
        name: 'destinationDirectory',
        message: 'Diretório de destino: ',
        type: 'input'
    },
    {
        name: 'archive_json',
        message: 'Arquivo JSON: ',
        type: 'input'
    }
]).then((answers) => execute(answers)).catch((err) => console.error(err));
