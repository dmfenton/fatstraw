const test = require('tape')
const createDefinition = require('../lib/create-definition')

test('Create a geoevent definition from a socrata view', t => {
  t.plan(1)
  const options = {
    user: 'dmfenton',
    name: 'Chicago_Taxi_Trips',
    track_id: 'trip_id',
    time_start: 'trip_start_timestamp',
    geometry: 'pickup_centroid_location',
    guid: 'ff5b7d7b-5b29-463e-9e77-9cdc760e72f2'
  }
  const view = require('./fixtures/socrata-view.json')
  const def = createDefinition.fromSocrata(view, options)
  const expected = require('./fixtures/taxi-trips-definition.json')
  t.deepEqual(def, expected, 'generated a correct definition')
})
