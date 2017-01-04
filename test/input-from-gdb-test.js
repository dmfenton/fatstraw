const test = require('tape')
const fromGDB = require('../lib/ingest/input/from-gdb')
const path = require('path')

test('Read out a geodatabase', t => {
  t.plan(4)
  const expectedFields = [
    'BikeInventory_ID',
    'RoadSegment_ID',
    'LocalName',
    'AlternateTrailName',
    'RegionalName',
    'CurrentOwner',
    'Steward',
    'FacilityStatus',
    'FacilityType',
    'AltFacilityType',
    'FacilityDetail',
    'TrafficDirection',
    'Surface',
    'BSG',
    'BSGkind',
    'Shape_Length',
    'Shape'
  ]
  const file = path.join(__dirname, './fixtures/BikeInventory.gdb')
  let i = 0
  let first = true
  fromGDB({file: file, layer: 'BikeInventory'})
  .each(f => {
    i++
    const fields = Object.keys(f)
    if (first) {
      t.deepEqual(fields, expectedFields, 'fields matched expected')
      t.ok(f.Shape.type, 'shape field has type')
      t.ok(f.Shape.coordinates, 'shape field has coordinates')
    }
    first = false
  })
  .done(() => {
    t.equal(i, 32098, 'all features present')
  })
})
