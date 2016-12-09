const times = {
  seconds: 'esriTimeUnitsSeconds',
  minutes: 'esriTimeUnitsMinutes',
  hours: 'esriTimeUnitsHours',
  days: 'esriTimeUnitsDays',
  months: 'esriTimeUnitsMonths',
  years: 'esriTimeUnitsYears',
  decades: 'esriTimeUnitsDecades',
  centuries: 'esriTimeUnitsCenturies'
}

const geoms = {
  point: 'esriGeometryPoint',
  line: 'esriGeometryLine',
  polygon: 'esriGeometryPolygon'
}

const layerDrawingInfo = require('./geoevent/default-drawing-info')

function createDataSource (options) {
  return {
    path: '',
    clusterName: 'default',
    serviceName: options.name,
    geometryType: geoms[options.geometryType],
    objectIdStrategy: 'ObjectId64Bit',
    rollingIndexStrategy: 'Yearly',
    overrideExisting: false,
    geoEventDefinitionGUID: options.guid,
    displayFieldName: options.displayField,
    dataSourceLayerName: options.name,
    dataSourceName: '',
    replicationFactor: 1,
    numberOfShards: 3,
    refreshInterval: 1,
    maxRecordCount: 10000,
    dataRetention: false,
    dataRetentionStrategy: 1,
    dataRetentionStrategyUnits: 'MONTHS',
    serviceType: 'All',
    sdsProvider: true,
    timeInterval: options.timeInterval || 1,
    timeIntervalUnits: times[options.timeUnits] || 'esriTimeUnitsMonths',
    hasLiveData: false,
    layerDrawingInfo: JSON.stringify(layerDrawingInfo),
    esriGeoHashes: [
      {
        style: 'square',
        sr: '102100',
        lods: 20
      },
      {
        style: 'flatTriangle',
        sr: '102100',
        lods: 20
      },
      {
        style: 'pointyTriangle',
        sr: '102100',
        lods: 20
      }
    ]
  }
}

module.exports = createDataSource
