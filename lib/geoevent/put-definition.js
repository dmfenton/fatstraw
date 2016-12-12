const request = require('request-promise').defaults({
  gzip: true,
  json: true
})

function putDefinition (definition, options) {
  const req = {
    method: 'PUT',
    url: `${options.server}/admin/geoeventdefinition/.json`,
    body: definition,
    headers: {
      GeoEventAuthorization: options.token,
      GeoEventReferer: `${options.server}/manager`
    }
  }
  return request(req)
  .then(res => {
    if (res.statusCode >= 400) throw new Error(res.statusCode)
    console.log(`status=success method=put object=definition`)
    return definition
  }, rejection => {
    throw new Error(rejection)
  })
}

module.exports = putDefinition
