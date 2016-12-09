const types = require('./socrata/types')
const assignGeometryFromSocrata = require('./create-definition').assignGeometryFromSocrata

function fromSocrata (view, options = {}) {
  const fields = view.columns
    .filter(col => {
      return !/:@computed/.test(col.fieldName)
    })
    .map(col => {
      return {
        name: col.fieldName,
        transform: types[col.dataTypeName].transform,
        alias: col.name
      }
    })
  return {
    geometry: options.geometry || assignGeometryFromSocrata(view),
    fields
  }
}

function fromCSV (headers, schema, options) {
  const fields = headers.map(field => {
    return {
      name: field,
      transform: schema[field].type,
      alias: field
    }
  })
  return {
    geometry: options.geometry,
    fields
  }
}

module.exports = { fromSocrata, fromCSV }
