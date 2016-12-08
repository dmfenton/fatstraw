const types = require('./socrata/types')
const uuid = require('uuid-random')

function fromSocrata (view, options) {
  const fieldDefinitions = view.columns
  .filter(col => {
    return !/:@computed/.test(col.fieldName)
  })
  .map(col => {
    const definition = {
      name: col.fieldName,
      type: types[col.dataTypeName].type,
      cardinality: 'One',
      fieldDefinitions: []
    }
    const tags = tagField(col.fieldName, options)
    if (tags.length) definition.fieldDefinitionTag = tags
    return definition
  })

  return {
    name: options.name || view.name.replace(/\s/g, '-').toLowerCase(),
    owner: options.owner,
    guid: options.guid || uuid(),
    accessType: 'editable',
    fieldDefinitions
  }
}

function tagField (field, options) {
  return ['TRACK_ID', 'TIME_START', 'TIME_END', 'GEOMETRY'].reduce((tags, tag) => {
    if (field.toLowerCase() === options[tag.toLowerCase()]) tags.push(tag)
    return tags
  }, [])
}

module.exports = { fromSocrata }
