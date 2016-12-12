const test = require('tape')
const createDefinition = require('../lib/create-definition')
const nock = require('nock')

test('Create a geoevent definition from a Socrata view', t => {
  const options = {
    dataset: 'http://foobar.com/api/views/1ef',
    user: 'dmfenton',
    name: 'Chicago_Taxi_Trips',
    track_id: 'trip_id',
    time_start: 'trip_start_timestamp',
    geometry: 'pickup_centroid_location',
    guid: 'ff5b7d7b-5b29-463e-9e77-9cdc760e72f2'
  }
  const expected = require('./fixtures/taxi-trips-definition.json')
  const view = require('./fixtures/taxi-trips-view.json')
  nock('http://foobar.com').get('/api/views/1ef').reply(200, view)
  createDefinition.fromSocrata(options).then(result => {
    t.ok(result.info, 'info about the dataset is returned')
    t.deepEqual(result.definition, expected, 'generated a correct definition')
    t.end()
  })
})

test('Create a geoevent definition from a File GeoDatabase', t => {
  const options = {
    dataset: `${__dirname}/fixtures/BikeInventory.gdb`,
    layer: 'BikeInventory',
    user: 'dmfenton',
    guid: 'ff5b7d7b-5b29-463e-9e77-9cdc760e72f2'
  }

  const expected = require('./fixtures/bike-inventory-definition.json')
  createDefinition.fromGDB(options).then(result => {
    t.ok(result.info, 'info about the dataset is returned')
    t.deepEqual(result.definition, expected, 'generated a correct definition')
    t.end()
  })
})
