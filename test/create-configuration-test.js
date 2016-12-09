const test = require('tape')
const createConfiguration = require('../lib/create-configuration')
const fs = require('fs')

test('Create a configuration from a Socrata View', t => {
  const view = require('./fixtures/socrata-view.json')
  const expected = require('./fixtures/taxis-configuration.js')
  const configuration = createConfiguration.fromSocrata(view)
  t.deepEqual(JSON.stringify(configuration), JSON.stringify(expected), 'configuration is correct')
  t.end()
})

test('Create a configuration from a CSV and an existing index', t => {
  const csv = fs.readFileSync(`${__dirname}/fixtures/sample-headers-match-schema.csv`).toString()
  const csvArray = csv.split('\n')
  const headers = csvArray[0].split(',')
  const schema = require('./fixtures/la-cert-schema.json')
  const options = {
    geometry: 'latitude_longitude'
  }
  const configuration = createConfiguration.fromCSV(headers, schema, options)
  const expected = require('./fixtures/la-cert-config.json')
  t.deepEqual(JSON.stringify(configuration), JSON.stringify(expected), 'configuration is correct')
  t.end()
})
