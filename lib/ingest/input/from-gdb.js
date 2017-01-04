const spawn = require('child_process').spawn
const FeatureParser = require('feature-parser')
const _ = require('highland')

module.exports = function (options) {
  let lastMessage
  const output = _()
  const ogr = spawn('ogr2ogr', ['-f', 'GeoJSON', '/vsistdout/', options.file, options.layer])
  .on('error', e => output.emit('error', e))
  .on('exit', (code, signal) => {
    if (code !== 0 || signal === 'SIGKILL') output.emit('error', new Error(`OGR Failed: ${lastMessage}`))
  })

  _(ogr.stderr)
  .split()
  .each(data => {
    const msg = data.toString()
    lastMessage = msg
    // Error 6: debug message that can be ignored
    if (msg.match(/ERROR\s[^6]/)) {
      output.emit('log', {level: 'error', message: msg})
      ogr.stderr.unpipe()
      ogr.kill('SIGKILL')
    }
  })

  _(ogr.stdout)
  .pipe(FeatureParser.parse())
  .map(JSON.parse)
  .map(feature => {
    const output = feature.properties
    if (feature.geometry.type === 'Point') {
      output.Shape = feature.geometry.coordinates
    } else {
      output.Shape = feature.geometry
    }

    return output
  })
  .pipe(output)

  return output
}
