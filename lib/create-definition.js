const socrataTypes = require('./socrata/types')
const getLayerInfo = require('./fgdb/get-layer-info')
const uuid = require('uuid-random')
const TAGS = ['track_id', 'time_start', 'time_end', 'geometry']

const request = require('request-promise').defaults({
  gzip: true,
  json: true
})

const createDefinition = {}
module.exports = createDefinition

createDefinition.fromGDB = function (options = {}) {
  return getLayerInfo(options.dataset, options.layer).then(layer => {
    const tagOptions = createTagOptions(null, options, layer.geometry_column)
    const fieldDefinitions = layer.fields.map(field => {
      field.tags = tagField(field.name, tagOptions)
      field.cardinality = 'One'
      field.fieldDefinitions = []
      return field
    })

    fieldDefinitions.push(makeGeometryField(layer))

    const definition = {
      name: options.name || layer.layer_name,
      owner: options.user,
      guid: options.guid || uuid(),
      accessType: 'editable',
      fieldDefinitions
    }
    return { definition, info: layer }
  }, e => { throw new Error(e) })
}

createDefinition.fromSocrata = function (options = {}) {
  return request(options.dataset).then(view => {
    const tagOptions = createTagOptions(view, options)
    const fieldDefinitions = view.columns
    .filter(col => {
      return !/:@computed/.test(col.fieldName)
    })
    .map(col => {
      const definition = {
        name: col.fieldName,
        type: socrataTypes[col.dataTypeName].type,
        cardinality: 'One',
        fieldDefinitions: []
      }
      const tags = tagField(col.fieldName, tagOptions)
      if (tags.length) definition.fieldDefinitionTag = tags
      return definition
    })

    const definition = {
      name: options.name || view.name.replace(/\s/g, '-').toLowerCase(),
      owner: options.user,
      guid: options.guid || uuid(),
      accessType: 'editable',
      fieldDefinitions
    }
    return { definition, info: view }
  }, e => { throw new Error(e) })
}

createDefinition.assignGeometryFromSocrata = function (view, options = {}) {
  return options.geometry || view.columns.filter(col => {
    return ['location', 'point', 'polygon', 'line'].indexOf(col.dataTypeName) > -1
  })[0].fieldName
}

function makeGeometryField (gdb) {
  return {
    name: gdb.geometry_column,
    type: 'Geometry',
    cardinality: 'One',
    fieldDefinitionTag: ['GEOMETRY'],
    fieldDefinitions: []
  }
}

function createTagOptions (view, options, geometry) {
  return {
    track_id: options.track_id,
    time_start: options.time_start,
    time_end: options.time_end,
    geometry: geometry || createDefinition.assignGeometryFromSocrata(view, options)
  }
}

function tagField (field, tagOptions) {
  return TAGS.reduce((tags, tag) => {
    if (field === tagOptions[tag]) tags.push(tag.toUpperCase())
    return tags
  }, [])
}
