'use strict'
const _ = require('highland')
const detectType = require('../lib/detectType')
const input = require('../lib/ingest/input')
const toBDS = require('../lib/ingest/output')

function builder (yargs) {
  return yargs
    .describe('f', 'The CSV to load into the BDS')
    .alias('f', 'file')
    .describe('h', 'user:pass@bds-url:9220')
    .alias('h', 'host')
    .describe('s', 'The name of the BDS service to be loaded')
    .alias('s', 'service')
    .describe('g', 'Field containing geometry data in BDS service')
    .alias('g', 'geometry')
    .describe('r', 'Max features per second to load')
    .default('r', 1000)
    .alias('r', 'rate')
    .describe('b', 'Max features to load per request')
    .default('b', 1000)
    .alias('b', 'batch')
    .describe('x', 'Field containing longitude data')
    .alias('x', 'lon')
    .describe('y', 'Field containing latitude data')
    .alias('y', 'lat')
    .describe('skip', 'How many rows to skip from the source')
    .describe('dry-run', 'Show payload but do not send to ES')
    .demand(['f', 'h', 's'])
    .describe('sniff', 'Discover other members of the ES cluster')
    .describe('id-start', 'Initial ObjectID')
    .example('fatstraw slurp -h user:pass@bds:9220 -f data.csv -s parking_violations -g Shape -x X -y Y')
}

function handler (options) {
  const rate = options.rate
  const batch = options.batch
  let start = options.start = Date.now()
  const type = detectType(options.file)
  input[type](options)
  .pipe(skipper(options.skip)) // skip features from the start of the source
  .ratelimit(rate, 1) // limit the features per second
  .batch(batch) // limit the features per bulk upload
  .pipe(toBDS(options))
  .done(() => {
    const elapsed = parseInt((Date.now() - start) / 1000, 10)
    console.log(`Bulk load complete in ${elapsed} seconds`)
  })
}

function skipper (drop) {
  if (drop) return _().drop(drop)
  else return _()
}

module.exports = {
  command: 'slurp',
  description: 'load data',
  handler,
  builder
}
