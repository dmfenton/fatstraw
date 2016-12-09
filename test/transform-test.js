const test = require('tape')
const transform = require('../lib/transform')
const fs = require('fs')

test('Transform a line from a csv into json', t => {
  const configuration = require('./fixtures/sample-config.json')
  const csv = fs.readFileSync(`${__dirname}/fixtures/sample.csv`).toString()
  const csvArray = csv.split('\n')
  const feature = csvArray[1]

  const json = transform.toJSON(feature, 0, configuration)
  const expected = require('./fixtures/sample-feature.json')

  t.ok(json.globalid, 'has a guid field')
  // guid is random so can't be tested easily
  delete json.globalid
  delete expected.globalid
  t.deepEqual(JSON.stringify(json), JSON.stringify(expected), 'transformed correctly')
  t.end()
})
