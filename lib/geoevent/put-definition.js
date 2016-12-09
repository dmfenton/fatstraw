const request = require('request-promise').defaults({
  gzip: true,
  json: true
})

function putDefinition (definition, options) {
  const req = {
    method: 'PUT',
    url: 'https://geoevent.koopernetes.com:6143/geoevent/admin/geoeventdefinition/.json',
    body: definition,
    headers: {
      GeoEventAuthorization: 'TjB-yFEZ9K2zDacJhqFwE1wy9UBGK_SiHc0wAiPWSf6YF04_Pv_joT2i-0q8G7iUz2O8RVHXJgRU--2S75tRumHp-Qqgjet9GYfNSp7x4ulKcngxBlkRW0kq6oSKNRD2FXq-JKiMX6NG6IeW-Wpt6Q0CU8L8BjuENi0XfcHB3nvpxL-AOSO2FOMgmk7P2H1V',
      GeoEventReferer: 'https://geoevent.koopernetes.com:6143/geoevent/manager'
    }
  }
  return request(req)
}

module.exports = putDefinition
