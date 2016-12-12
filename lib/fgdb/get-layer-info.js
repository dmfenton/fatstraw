'use strict'
const exec = require('mz/child_process').exec
const types = require('./types')

// transform output from ogrinfo into a useful pojo
module.exports = function getLayerInfo (gdb, layer) {
  const cmd = `ogrinfo -so -ro ${gdb} ${layer}`
  return exec(cmd).then(stdout => {
    const output = stdout[0].toString()
    if (/FAILURE:/.test(output)) {
      const error = output.split(/FAILURE: /)[1].replace(/\n/g, '')
      throw new Error(error)
    }

    const lines = output.split(/\n(?!\s)/)
    return translate(lines)
  }, rejection => {
    throw new Error(rejection)
  })
}

function translate (lines) {
  const info = lines.reduce(decode, {})

  info.feature_count = parseInt(info.feature_count, 10)
  info.fields = info.fields.map(field => {
    const key = Object.keys(field)[0]
    const type = field[key].split(/ /)[0].toLowerCase()
    const fieldInfo = {
      name: key,
      type: types[type].type
    }
    return fieldInfo
  })
  return info
}

function decode (obj, line, i) {
  // first line is just info we can skip
  if (i === 0) return { fields: [] }
  // last line is empty
  if (line === '') return obj
  // lines 5 6 and contain srs split into two lines
  if (i === 5) return obj
  if (i === 6) {
    obj['layer_srs_wkt'] = line.replace(/\n\s+/g, '')
    return obj
  }
  // a few fields are key = value
  let parts
  if (/=/.test(line)) {
    parts = line.split(/ = /)
    obj[makeKey(parts[0])] = parts[1]
    return obj
  }

  // the rest of the keys are key: value
  parts = line.split(/: /)
  if (i < 8) {
    obj[makeKey(parts[0])] = parts[1]
  } else {
    // all the fields come are line 8
    const field = {}
    field[parts[0]] = parts[1]
    obj.fields.push(field)
  }

  return obj
}

function makeKey (raw) {
  return raw.replace(/\s/, '_').toLowerCase()
}

/* Sample of ogrinfo output
INFO: Open of `Violations.gdb'
      using driver `OpenFileGDB' successful.

Layer name: MovingViolations
Geometry: Point
Feature Count: 4939387
Extent: (390090.200000, 127307.600000) - (407828.700000, 147215.290000)
Layer SRS WKT:
PROJCS["NAD83 / Maryland",
    GEOGCS["NAD83",
        DATUM["North_American_Datum_1983",
            SPHEROID["GRS 1980",6378137,298.257222101,
                AUTHORITY["EPSG","7019"]],
            TOWGS84[0,0,0,0,0,0,0],
            AUTHORITY["EPSG","6269"]],
        PRIMEM["Greenwich",0,
            AUTHORITY["EPSG","8901"]],
        UNIT["degree",0.0174532925199433,
            AUTHORITY["EPSG","9122"]],
        AUTHORITY["EPSG","4269"]],
    PROJECTION["Lambert_Conformal_Conic_2SP"],
    PARAMETER["standard_parallel_1",39.45],
    PARAMETER["standard_parallel_2",38.3],
    PARAMETER["latitude_of_origin",37.66666666666666],
    PARAMETER["central_meridian",-77],
    PARAMETER["false_easting",400000],
    PARAMETER["false_northing",0],
    UNIT["metre",1,
        AUTHORITY["EPSG","9001"]],
    AXIS["X",EAST],
    AXIS["Y",NORTH],
    AUTHORITY["EPSG","26985"]]
FID Column = OBJECTID
Geometry Column = SHAPE
ROW_: Real (0.0)
LOCATION: String (255.0)
ADDRESS_ID: Integer (0.0)
STREETSEGID: Integer (0.0)
XCOORD: Real (0.0)
YCOORD: Real (0.0)
TICKETTYPE: String (50.0)
FINEAMT: Real (0.0)
TOTALPAID: Real (0.0)
PENALTY1: Real (0.0)
PENALTY2: Real (0.0)
ACCIDENTINDICATOR: String (50.0)
AGENCYID: Integer (0.0)
TICKETISSUEDATE: DateTime (0.0)
VIOLATIONCODE: String (50.0)
VIOLATIONDESC: String (500.0)
ROW_ID: String (50.0)
SE_ANNO_CAD_DATA: Binary (0.0)
*/
