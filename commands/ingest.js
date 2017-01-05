'use strict'
const _ = require('highland')
const detectType = require('../lib/detect-type')
const input = require('../lib/ingest/input')
const toBDS = require('../lib/ingest/output/to-bds')
const Elasticsearch = require('elasticsearch')
const fs = require('fs')

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

function handler (options, callback) {
  const client = new Elasticsearch.Client({host: options.host, apiVersion: '2.3', sniffOnStart: options['sniff']})
  return new Promise((resolve, reject) => {
    const rate = options.rate
    const batch = options.batch
    const service = options.service
    let start = options.start = Date.now()
    let payload
    const type = detectType(options.file)
    client.indices.getMapping({index: service, type: service})
    .then(mappings => {
      input[type](mappings, options) // open up a stream from the source data
      .pipe(skipper(options.skip)) // skip features from the start of the source
      .pipe(taker(options.take)) // take only n features
      .ratelimit(rate, 1) // limit the features per second
      .batch(batch) // limit the features per bulk upload
      .pipe(toBDS(mappings, options)) // bulk load into the BDS
      .each(p => { payload = p }) // capture payload for dry-run inspection
      .done(() => {
        const elapsed = parseInt((Date.now() - start) / 1000, 10)
        console.log(`Bulk load complete in ${elapsed} seconds`)
        if (options['dry-run']) fs.writeFileSync('./slurp.test.log', payload)
        resolve(payload)
      })
    }, rejection => {
      console.trace(rejection)
      process.exit(1)
    })
  })
}

function skipper (drop) {
  if (drop) return _().drop(drop)
  else return _()
}

function taker (take) {
  if (take) return _().take(take)
  else return _()
}

module.exports = {
  command: 'slurp',
  description: 'load data',
  handler,
  builder
}
