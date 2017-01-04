module.exports = function detectType (dataset) {
  if (/api\/view/.test(dataset)) return 'fromSocrata'
  else if (/gdb/.test(dataset)) return 'fromGDB'
  else if (/csv$/.test(dataset)) return 'fromCSV'
}
