'use strict'
const _ = require('highland')
const fs = require('fs')
const request = require('request').defaults({gzip: true})
const Elasticsearch = require('elasticsearch')
const transform = require('./lib/transform')

// Set up CLI Arguments
const cmd = require('./lib/cmd')

const rate = cmd.rate
const batch = cmd.batch
const service = cmd.service
const host = cmd.host
const file = cmd.file

const client = new Elasticsearch.Client({host, apiVersion: '2.3', sniffOnStart: cmd['sniff']})
const errorLog = fs.createWriteStream('slurp.error.log')

let action
let schema
let objectid = cmd['id-start'] || 0
let completed = 0
let pending
let start = Date.now()
let first = true
let lastCompleted
let failureCount = 0

client.indices.getMapping({index: service, type: service})
.then((mappings) => {
  const indexes = Object.keys(mappings)
  let featureIndex
  if (indexes.length > 1) {
    featureIndex = indexes.filter((index) => {
      return /_20/.test(index)
    })[0]
  } else {
    featureIndex = indexes[0]
  }
  schema = mappings[featureIndex].mappings[service].properties
  action = JSON.stringify({ index: { _index: featureIndex, _type: service } })

  let fieldNames
  getFile(file)
  .split() // split the CSV by line
  .map((feature) => {
    if (first) {
      fieldNames = feature.split(',').map(h => { return h.trim().replace(/\s+/g, '_') })
      first = false
      return
    }
    objectid++
    return transform.toJSON(feature, schema, fieldNames, objectid, cmd)
  }) // convert each row to JSON docs
  .compact()
  .pipe(skipper(cmd.skip)) // skip features from the start of the soruce
  .ratelimit(rate, 1) // limit the features per second
  .batch(batch) // limit the features per bulk upload
  .map((batch) => { // prepare the batch payload for Elasticsearch
    pending = batch.length
    const payload = batch.reduce((operation, doc) => {
      return `${operation}${action}\n${JSON.stringify(doc)}\n`
    }, '')
    return payload
  })
  .flatMap((payload) => { // send the requests off to ES
    if (cmd['dry-run']) console.log(payload) && process.exit(0)
    else return _(client.bulk({body: payload}))
  })
  .errors((e) => errorLog.write(e.stack)) // log any HTTP failures
  .each((res) => { // log progress
    const errors = res.items.filter((item) => { return item.create.error })
    failureCount += errors.length
    if (errors.length) errors.map(error => errorLog.write(JSON.stringify(error)))
    const elapsed = (Date.now() - start) / 1000
    let time = (Date.now() - lastCompleted) / 1000
    if (first) time = elapsed
    completed += pending
    console.log(`completed=${completed} failed=${failureCount} time=${time} elapsed=${elapsed}`)
    first = false
    lastCompleted = Date.now()
  })
  .done(() => {
    const elapsed = parseInt((Date.now() - start) / 1000, 10)
    console.log(`Bulk load complete in ${elapsed} seconds`)
  })
}, (e) => {
  errorLog.write(e.stack) && process.exit(1)
})
.catch(e => {
  errorLog.write.error(e.stack)
})

function getFile (file) {
  let stream
  if (file.match(/http/)) stream = request(file)
  else stream = fs.createReadStream(file)
  return _(stream)
}

function skipper (drop) {
  if (drop) return _().drop(drop)
  else return _()
}
