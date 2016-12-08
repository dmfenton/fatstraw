'use strict'
const cmd = require('./lib/cmd')
const prepare = require('./lib/prepare')
const ingest = require('./lib/ingest')

const actions = {
  prepare: prepare,
  slurp: ingest
}

actions[cmd.command](cmd)
