const test = require('tape')
const createConfiguration = require('../lib/create-configuration')

test('Create a configuration from a Socrata View', (t) => {
  t.plan(1)
  const view = require('./fixtures/socrata-view.json')
  const expected = require('./fixtures/configuration.js')
  const configuration = createConfiguration.fromSocrata(view)
  t.deepEqual(JSON.stringify(configuration), JSON.stringify(expected), 'configuration is correct')
})
