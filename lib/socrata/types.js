const transform = require('../transform')
module.exports = {
  number: {
    type: 'Double',
    transform: transform.xf.double
  },
  double: {
    type: 'Double',
    transform: transform.xf.double
  },
  calendar_date: {
    type: 'Date',
    transform: transform.xf.date
  },
  text: {
    type: 'String',
    transform: transform.xf.String
  },
  money: {
    type: 'Double',
    transform: transform.xf.money
  },
  location: {
    type: 'Geometry',
    transform: transform.xf.socrataLocation
  },
  point: {
    type: 'Geometry',
    transform: transform.xf.wkt.point
  },
  polygon: {
    type: 'Geometry',
    transform: transform.xf.notHandled
  },
  line: {
    type: 'Geometry',
    transform: transform.xf.notHandled
  },
  multiline: {
    type: 'Geometry',
    transform: transform.xf.notHandled
  },
  multipoint: {
    type: 'Geometry',
    transform: transform.xf.notHandled
  },
  multipolygon: {
    type: 'Geometry',
    transform: transform.xf.notHandled
  },
  checkbox: {
    type: 'boolean',
    transform: transform.xf.boolean
  },
  timestamp: {
    type: 'Date',
    transform: transform.xf.date
  }
}
