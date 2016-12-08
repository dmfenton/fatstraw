#!/usr/bin/env node
'use strict'
const _ = require('highland')
const fs = require('fs')
const request = require('request').defaults({gzip: true})
const uuid = require('uuid-random')
const wkt = require('wellknown')
const Elasticsearch = require('elasticsearch')
const transform = require('./lib/transform')

// Set up CLI Arguments
const argv = require('./lib/cmd')

const rate = argv.rate
const batch = argv.batch
const service = argv.service
const host = argv.host
const file = argv.file
const geomField = argv.geometry || 'shape'

const client = new Elasticsearch.Client({host, apiVersion: '2.3', sniffOnStart: argv['sniff']})
const errorLog = fs.createWriteStream('slurp.error.log')

let action
let schema
let objectid = argv['id-start'] || 0
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
    return transform.toJSON(feature, schema, fieldNames)
  }) // convert each row to JSON docs
  .compact()
  .pipe(skipper(argv.skip)) // skip features from the start of the soruce
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
    if (argv['dry-run']) console.log(payload) && process.exit(0)
    else return _(client.bulk({body: payload}))
  })
  .errors((e) => console.error(e)) // log any HTTP failures
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
  console.error(e) && process.exit(1)
})
.catch(e => {
  console.error(e)
})

// Functions for coeercing fields to the proper type
const xf = {
  integer (x) {
    return parseInt(x, 10)
  },
  float (x) {
    return parseFloat(x)
  },
  double (x) {
    // handle money types w/in double
    return parseFloat(x && x.replace(/\$/g, ''))
  },
  short (x) {
    return parseInt(x)
  },
  long (x) {
    return parseInt(x)
  },
  string (x) {
    return String(x)
  },
  date (x) {
    return new Date(x).getTime()
  },
  geo_point (x) {
    // TODO what types do I want to handle here?
    // geojson, x,y, [lon, lat]
    try {
      if (/\(-?\d{1,3}\.\d+, -?\d{1,3}\.\d+\)/.test(x)) { // e.g. (-42.10, 128.19)
        return x.replace(/\(|\)/g, '').split(',').join(',').replace(/\s+/g, '')
      } else { // handle wkt e.g. point( 78, 31 )
        return wkt.parse(x).coordinates.reverse().join(',')
      }
    } catch (e) {
      return null
    }
  }
}

// converts each feature to a JSON doc for ES
function toJSON (feature, schema, fieldNames) {
  const values = toArray(feature)
  const doc = fieldNames.reduce((obj, field, i) => {
    if (schema[field]) {
      obj[field] = xf[schema[field].type](values[i])
    } else {
      obj[field] = values[i]
    }
    return obj
  }, {})

  if (argv.lat && argv.lon) doc[geomField] = [doc[argv.lat], doc[argv.lon]].join(',')

  doc['---geo_hash---'] = doc[geomField]
  doc.globalid = `{${uuid().toUpperCase()}}`
  doc.objectid = objectid

  objectid++
  return doc
}

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

// Stack Overflow FTW http://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
function toArray (text) {
  const reValue = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g
  const a = [] // Initialize array to receive values.
  text.replace(reValue, function (m0, m1, m2, m3) { // "Walk" the string using replace with callback.
    // Remove backslash from \' in single quoted values.
    if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"))
      // Remove backslash from \" in double quoted values.
    else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'))
    else if (m3 !== undefined) a.push(m3)
    return '' // Return empty string.
  })
    // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push('')
  return a
};
