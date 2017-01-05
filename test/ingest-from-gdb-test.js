const test = require('tape')
const ingest = require('../commands/ingest').handler
const path = require('path')
const nock = require('nock')

test('Ingest a file geodatabase into the BDS', t => {
  nock('http://foobar:9200')
  .get('/').reply(200)
  .get('/download_test/_mapping/download_test').reply(200, {index: {}})
  const file = path.join(__dirname, './fixtures/points.gdb')
  const options = {
    file,
    service: 'download_test',
    layer: 'download_test',
    host: 'foobar:9200',
    'dry-run': true
  }
  ingest(options)
  .then((payload) => {
    t.deepEqual(payload.split(/\n/).length, require('./fixtures/bulk.js').split(/\n/).length, 'bulk payload built correctly')
    t.end()
  }, (rejection) => t.fail())
})
