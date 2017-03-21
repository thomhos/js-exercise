#! /usr/bin/env node

/*
 *  Process a JSON file into data structure definitions.
 */
const fs = require('fs')
const program = require('commander')
const pkg = require('./package.json')
const InterfaceExtractor = require('./lib/extract-interfaces')

/* Define new instance of InterfaceExtractor */
const extractor = new InterfaceExtractor()

/*
 *  Define the CLI interface
 */
program
    .version(pkg.version)
    .arguments('<file>') // First argument is required
    .action(processInputFile)
    .parse(process.argv)


/*
 *  Handle and validate the CLI input
 */
function processInputFile(filePath) {
    /* If no filePath provided, exit with error */
    if (typeof filePath === 'undefined') {
        console.error('No input file provided!')
        process.exit(1)
    }

    /* Read the input filePath */
    const file = fs.readFileSync(filePath, 'utf-8')

    /* Try to parse the file contents */
    let json = null

    try {
        json = JSON.parse(file)
    } catch (error) {
        console.error('No valid JSON provided!')
        console.error(error)
        process.exit(1)
    }

    /* JSON is valid, extract the interfaces */
    const interfaces = extractor.go(json)
    writeJsonWithInterfaces(interfaces)
}

function writeJsonWithInterfaces(interfaces) {
    /* Format the interface object to a typescript interface definition */
    for (let i in interfaces) {
        const currentInterface = interfaces[i]
        Object.keys(currentInterface).map(prop => {
            /* Add the question mark if the property is optional */
            if (currentInterface[prop].optional) {
                currentInterface[prop + '?'] = currentInterface[prop].type
                delete currentInterface[prop]
            } else {
                currentInterface[prop] = currentInterface[prop].type
            }
        })
    }

    /* Write JSON output */
    //console.log(interfaces)
    fs.writeFileSync('./output.json', JSON.stringify(interfaces), 'utf8')
}
