const types = require('./socrata/types')
const uuid = require('uuid-random')
const TAGS = ['track_id', 'time_start', 'time_end', 'geometry']

function fromSocrata (view, options = {}) {
  const tagOptions = createTagOptions(view, options)
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
    const tags = tagField(col.fieldName, tagOptions)
    if (tags.length) definition.fieldDefinitionTag = tags
    return definition
  })

  return {
    name: options.name || view.name.replace(/\s/g, '-').toLowerCase(),
    owner: options.user,
    guid: options.guid || uuid(),
    accessType: 'editable',
    fieldDefinitions
  }
}

function createTagOptions (view, options) {
  return {
    track_id: options.track_id,
    time_start: options.time_start,
    time_end: options.time_end,
    geometry: assignGeometryFromSocrata(view, options)
  }
}

function assignGeometryFromSocrata (view, options = {}) {
  return options.geometry || view.columns.filter(col => {
    return ['location', 'point', 'polygon', 'line'].indexOf(col.dataTypeName) > -1
  })[0].fieldName
}

function tagField (field, tagOptions) {
  return TAGS.reduce((tags, tag) => {
    if (field === tagOptions[tag]) tags.push(tag.toUpperCase())
    return tags
  }, [])
}

module.exports = { fromSocrata, assignGeometryFromSocrata }
