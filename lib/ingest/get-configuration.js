const fs = require('fs')
module.exports = function getConfig (cmd) {
  if (cmd.configuration) {
    return JSON.parse(fs.readFileSync(cmd.configuration))
  } else {
    try {
      return JSON.parse(fs.readFileSync(`${cmd.service}-configuration.json`))
    } catch (e) {
      return null
    }
  }
}
