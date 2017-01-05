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

function fromCSV (headers, schema, options = {}) {
  const fields = headers.map(field => {
    return {
      name: field,
      transform: schema[field].type,
      alias: field
    }
  })
  const config = {
    geometry: options.geometry,
    fields
  }
  if (options.delimiter) config.delimiter = options.delimiter
  return config
}

function fromGDB (layer, options = {}) {
  const fields = layer.fields.map(field => {
    return {
      name: field.name,
      transform: field.type,
      alias: field.name
    }
  })
  return {
    geometry: layer.geometry,
    fields
  }
}

module.exports = { fromSocrata, fromCSV, fromGDB }
