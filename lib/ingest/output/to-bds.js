const _ = require('highland')

const fs = require('fs')
const log = fs.createWriteStream('slurp.error.log')


module.exports = function (mappings, options) {

  const service = options.service

  let pending
  let first = true
  let lastCompleted
  let failureCount = 0
  let completed = 0

  const indexes = Object.keys(mappings)
  let featureIndex
  if (indexes.length > 1) {
    featureIndex = indexes.filter((index) => { return /_20/.test(index) })[0]
  } else {
    featureIndex = indexes[0]
  }
  const action = JSON.stringify({ index: { _index: featureIndex, _type: service } })

  return _.pipeline(stream => {
    return stream
    .map(batch => { // prepare the batch payload for Elasticsearch
      pending = batch.length
      const payload = batch.reduce((operation, doc) => {
        return `${operation}${action}\n${JSON.stringify(doc)}\n`
      }, '')
      return payload
    })
    .flatMap(payload => { // send the requests off to ES
      if (options['dry-run']) return _([payload])
      else return _(client.bulk({body: payload}))
    })
    .errors(e => { log.write(e.stack) }) // log any HTTP failures
    .map(res => { // log progress
      if (options['dry-run']) return res
      const errors = res.items.filter((item) => { return item.create.error })
      failureCount += errors.length
      if (errors.length) errors.map(error => log.write(JSON.stringify(error)))
      const elapsed = (Date.now() - options.start) / 1000
      let time = (Date.now() - lastCompleted) / 1000
      if (first) time = elapsed
      first = false
      completed += pending
      console.log(`completed=${completed} failed=${failureCount} time=${time} elapsed=${elapsed}`)
      first = false
      lastCompleted = Date.now()
      return true
    })
  })
  return input
}
