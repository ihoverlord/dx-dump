const fs = require('fs')
const shell = require('shelljs');
const appRoot = require('app-root-path');
const moment = require('moment')

const MONGODB_URI_REGEX = new RegExp("^(mongodb:(?:\/{2})?)((\w+?):(\w+?)@|:?@?)(\w+?):(\d+)\/(\w+?)$")
const DUMP_PATH = `${appRoot}/dump/mongodb-${moment().format('YYYY-MM-DD::HH:m:s')}`
const configParser = async () => {
    let config = {}
    if (fs.existsSync('./config.json')) {
        config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
    }
    else {
        return new Error('Config.json file doesnt not exist')
    }
    return config
}

const run = async () => {
    try {
        const config = await configParser()
        shell.exec(`mongodump --uri ${config.from} --out ${DUMP_PATH}`)
        if(typeof config.to === 'string') config.to = [config.to]
        config.to.forEach(db => shell.exec(`mongorestore --uri ${db} ${DUMP_PATH}`))
    } catch (error) {
        console.log(error)
    }

}

run()