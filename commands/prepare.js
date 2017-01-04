const createDefinition = require('../lib/create-definition')
const createDataSource = require('../lib/create-data-source')
const putDefinition = require('../lib/geoevent/put-definition')
const publishDataSource = require('../lib/geoevent/publish-data-source')
const createConfiguration = require('../lib/create-configuration')
const detectType = require('../lib/detect-type')
const fs = require('fs')

function builder (yargs) {
  return yargs
    .describe('d', 'The source dataset')
    .alias('d', 'dataset')
    .describe('t', 'An authorization token')
    .alias('t', 'token')
    .describe('u', 'GeoEvent User')
    .alias('u', 'user')
    .describe('p', 'GeoEvent Password')
    .alias('p', 'password')
    .describe('l', 'Layer in GeoDatabase')
    .alias('l', 'layer')
    .describe('s', 'GeoEvent server')
    .alias('s', 'server')
    .demand(['dataset', 'server', 'token', 'user'])
}

function handler (options) {
  let info
  let definition
  const type = detectType(options.dataset)
  createDefinition[type](options)
  .then(result => {
    info = result.info
    return putDefinition(result.definition, options)
  }, handleRejection)
  .then(result => {
    definition = result
    return dataSource(definition, options)
  }, handleRejection)
  .then(res => {
    if (res.results[0].status === 'error') throw new Error(res.results[0].messages[0])
    console.log(`status=success method=post object=datasource`)
    if (res.statusCode >= 400) throw new Error(res.statusCode)
    const configuration = createConfiguration[type](info)
    const fileName = `${definition.name}-configuration.json`
    fs.writeFileSync(fileName, JSON.stringify(configuration))
    console.log(`status=success output=${fileName}`)
  }, handleRejection)
  .catch(handleRejection)
}

function dataSource (definition, options) {
  const dsOptions = {
    name: definition.name,
    geometryType: 'point',
    guid: definition.guid,
    dataSourceLayerName: definition.name,
    timeUnits: options.timeUnits,
    timeInterval: options.timeInterval,
    displayField: definition.fieldDefinitions[0].name
  }
  const dataSource = createDataSource(dsOptions)
  return publishDataSource(dataSource, options)
}

function handleRejection (rejection) {
  console.log(`status=fail error=${rejection}`)
  console.trace(rejection)
  process.exit(1)
}

module.exports = {
  command: 'prepare',
  description: 'prepare a dataset',
  builder,
  handler
}
