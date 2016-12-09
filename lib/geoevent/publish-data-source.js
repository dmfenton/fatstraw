const request = require('request-promise').defaults({
  gzip: true,
  json: true
})

function publishDataSource (dataSource, options) {
  const req = {
    method: 'POST',
    url: 'https://geoevent.koopernetes.com:6143/geoevent/admin/datastores/agsconnection/default/publishBDSService/.json',
    body: dataSource,
    headers: {
      GeoEventAuthorization: options.token,
      GeoEventReferer: 'https://geoevent.koopernetes.com:6143/geoevent/manager'
    }
  }
  return request(req)
}

module.exports = publishDataSource
