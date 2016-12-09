const types = require('./socrata/types')

function fromSocrata (view) {
  const fields = view.columns
    .filter(col => {
      return !/:@computed/.test(col.fieldName)
    })
    .map(col => {
      return {
        field: col.fieldName,
        transform: types[col.dataTypeName].transform,
        csv: col.name
      }
    })
  return { fields }
}

module.exports = { fromSocrata }
