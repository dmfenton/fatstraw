const createDefinition = require('../lib/create-definition')
const createDataSource = require('../lib/create-data-source')
const putDefinition = require('../lib/geoevent/put-definition')
const publishDataSource = require('../lib/geoevent/publish-data-source')
const createConfiguration = require('../lib/create-configuration')
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

function handler (cmd) {
  let info
  let definition
  const type = detectType(cmd.dataset)
  createDefinition[type](cmd)
  .then(result => {
    info = result.info
    return putDefinition(result.definition, cmd)
  }, handleRejection)
  .then(definition => { return dataSource(definition, cmd) }, handleRejection)
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

function detectType (dataset) {
  if (/api\/view/.test(dataset)) return 'fromSocrata'
  else if (/gdb/.test(dataset)) return 'fromGDB'
  else if (/csv$/.test(dataset)) return 'fromCSV'
}

function dataSource (definition, cmd) {
  const dsOptions = {
    name: definition.name,
    geometryType: 'point',
    guid: definition.guid,
    dataSourceLayerName: definition.name,
    timeUnits: cmd.timeUnits,
    timeInterval: cmd.timeInterval,
    displayField: definition.fieldDefinitions[0].name
  }
  const dataSource = createDataSource(dsOptions)
  return publishDataSource(dataSource, cmd)
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
