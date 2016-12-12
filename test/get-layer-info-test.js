const test = require('tape')
const getLayerInfo = require('../lib/fgdb/get-layer-info')
const path = require('path')
const BikeInventory = path.join(__dirname, './fixtures/BikeInventory.gdb')

test('Get info about a fgdb layer', t => {
  const expected = require('./fixtures/bike-inventory-info.json')
  getLayerInfo(BikeInventory, 'BikeInventory').then(info => {
    t.deepEqual(expected, info, 'output translated correctly')
  }, e => t.fail(e))
  t.end()
})

test('Capture error when things fail', t => {
  getLayerInfo(BikeInventory, 'nolayer').then(info => {
    t.fail('Should not resolve')
    t.end()
  }, e => {
    t.ok(e, 'error handled correctly')
    t.end()
  })
})
