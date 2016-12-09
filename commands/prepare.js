const createDefinition = require('../lib/create-definition')
const createDataSource = require('../lib/create-data-source')
const putDefinition = require('../lib/geoevent/put-definition')
const publishDataSource = require('../lib/geoevent/publish-data-source')
const createConfiguration = require('../lib/create-configuration')
const fs = require('fs')
const request = require('request-promise').defaults({
  gzip: true,
  json: true
})

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
}

function handler (cmd) {
  let view
  let definition
  request(cmd.dataset)
  .then(res => {
    console.log(`status=success method=get object=view`)
    if (res.statusCode >= 400) throw new Error(res.statusCode)
    view = res
    definition = createDefinition.fromSocrata(view, cmd)
    return putDefinition(definition)
  }, handleRejection)
  .then(res => {
    console.log(`status=success method=put object=definition`)
    if (res.statusCode >= 400) throw new Error(res.statusCode)
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
    console.log(JSON.stringify(dataSource, null, 2))
    return publishDataSource(dataSource, cmd)
  }, handleRejection)
  .then(res => {
    if (res.results[0].status === 'error') throw new Error(res.results[0].messages[0])
    console.log(`status=success method=post object=datasource`)
    if (res.statusCode >= 400) throw new Error(res.statusCode)
    const configuration = createConfiguration.fromSocrata(view)
    const fileName = `${definition.name}-configuration.json`
    fs.writeFileSync(fileName, JSON.stringify(configuration))
    console.log(`status=success output=${fileName}`)
  }, handleRejection)
  .catch(handleRejection)
}

function handleRejection (rejection) {
  console.log(`status=fail error=${rejection}`)
  process.exit(1)
}

module.exports = {
  command: 'prepare',
  description: 'prepare a dataset',
  builder,
  handler
}
