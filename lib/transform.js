const wkt = require('wellknown')
const uuid = require('uuid-random')
const parse = require('csv-parse/lib/sync')
// Functions for coeercing fields to the proper type

const xf = {
  boolean (x) {
    return !!x
  },
  integer (x) {
    return parseInt(x, 10)
  },
  float (x) {
    return parseFloat(x)
  },
  double (x) {
    if (/\$/.test(x)) return xf.money(x)
    return parseFloat(x)
  },
  money (x) {
    if (!x || !x.replace) return null
    return parseFloat(x.replace(/\$/g, ''))
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
        return xf.socrataLocation(x)
      } else { // handle wkt e.g. point( 78, 31 )
        return xf.wkt.point(x)
      }
    } catch (e) {
      return null
    }
  },
  socrataLocation (x) {
    if (!x || !x.replace) return null
    return x
      .replace(/\(|\)/g, '')
      .split(',')
      .join(',')
      .replace(/\s+/g, '')
  },
  wktPoint (x) {
    return wkt.parse(x)
    .coordinates
    .reverse()
    .join(',')
  },
  notHandled () {
    throw new Error('Type is not yet implemented')
  }
}

// converts each feature to a JSON doc for ES
function toJSON (feature, objectid, config) {
  const geomField = config.geometry || 'shape'
  const values = parse(feature, {delimiter: config.delimiter || ','})[0]
  const doc = config.fields.reduce((obj, field, i) => {
    const feature = values[i]
    const transform = xf[field.transform]
    obj[field.name] = transform(feature)
    return obj
  }, {})

  if (config.lat && config.lon) doc[geomField] = [doc[config.lat], doc[config.lon]].join(',')

  doc['---geo_hash---'] = doc[geomField]
  doc.globalid = `{${uuid().toUpperCase()}}`
  doc.objectid = objectid

  return doc
}

module.exports = { toJSON, xf }
