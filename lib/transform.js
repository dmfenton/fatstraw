const wkt = require('wellknown')
const uuid = require('uuid-random')
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
        return xf.socrataLocation(x)
      } else { // handle wkt e.g. point( 78, 31 )
        return xf.wkt.point(x)
      }
    } catch (e) {
      return null
    }
  },
  socrataLocation (x) {
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
  const values = toArray(feature)
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
}

module.exports = { toJSON, xf }
