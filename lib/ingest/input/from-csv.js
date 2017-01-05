const getFile = require('../get-file')
const getConfig = require('../get-configuration')
const createConfiguration = require('../../create-configuration')
const transform = require('../../transform')
const Elasticsearch = require('elasticsearch')
const _ = require('highland')

module.exports = function (file, options) {
  const output = _()
  const client = new Elasticsearch.Client({host: options.host, apiVersion: '2.3', sniffOnStart: options['sniff']})
  const service = options.service
  client.indices.getMapping({index: service, type: service})
  .then((mappings) => {
    let first = true
    let configuration = getConfig(options)
    let objectid = options['id-start'] || 0
    return getFile(file)
    .split() // split the CSV by line
    .compact()
    .map((feature) => {
      if (first) {
        const fieldNames = feature.split(options.delimiter || ',').map(h => { return h.trim().replace(/\s+/g, '_') })
        const index = Object.keys(mappings)[0]
        const schema = mappings[index].mappings[service].properties
        if (!configuration) configuration = createConfiguration.fromCSV(fieldNames, schema, options)
        first = false
        return
      }
      objectid++
      return transform.toJSON(feature, objectid, configuration)
    }) // convert each row to JSON docs
    .compact()
    .pipe(output)
  })

  return output
}
