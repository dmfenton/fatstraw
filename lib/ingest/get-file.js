const fs = require('fs')
const request = require('request').defaults({gzip: true})
const _ = require('highland')

module.exports = function getFile (file) {
  let stream
  if (file.match(/^https?:\/\//)) stream = request(file)
  else stream = fs.createReadStream(file)
  return _(stream)
}
