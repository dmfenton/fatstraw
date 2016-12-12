const request = require('request-promise').defaults({
  gzip: true,
  json: true
})

function publishDataSource (dataSource, options) {
  const req = {
    method: 'POST',
    url: `${options.server}/admin/datastores/agsconnection/default/publishBDSService/.json`,
    body: dataSource,
    headers: {
      GeoEventAuthorization: options.token,
      GeoEventReferer: `${options.server}/manager`
    }
  }
  return request(req)
}

module.exports = publishDataSource
