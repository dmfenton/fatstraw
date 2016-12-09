module.exports = {
  number: {
    type: 'Double',
    transform: 'double'
  },
  double: {
    type: 'Double',
    transform: 'double'
  },
  calendar_date: {
    type: 'Date',
    transform: 'date'
  },
  text: {
    type: 'String',
    transform: 'string'
  },
  money: {
    type: 'Double',
    transform: 'money'
  },
  location: {
    type: 'Geometry',
    transform: 'socrataLocation'
  },
  point: {
    type: 'Geometry',
    transform: 'wktPoint'
  },
  polygon: {
    type: 'Geometry',
    transform: 'notHandled'
  },
  line: {
    type: 'Geometry',
    transform: 'notHandled'
  },
  multiline: {
    type: 'Geometry',
    transform: 'notHandled'
  },
  multipoint: {
    type: 'Geometry',
    transform: 'notHandled'
  },
  multipolygon: {
    type: 'Geometry',
    transform: 'notHandled'
  },
  checkbox: {
    type: 'boolean',
    transform: 'boolean'
  },
  timestamp: {
    type: 'Date',
    transform: 'date'
  }
}
