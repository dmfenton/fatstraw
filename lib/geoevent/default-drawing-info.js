module.exports = {
  renderer: {
    type: 'aggregation',
    style: 'Grid',
    featureThreshold: 0,
    lodOffset: -11,
    minBinSizeInPixels: 10,
    labels: {
      color: [0, 0, 0, 255],
      font: 'Arial',
      size: 12,
      style: 'PLAIN',
      format: '###.##'
    },
    binRenderer: {
      type: 'Continuous',
      normalizeByBinArea: false,
      minColor: [255, 0, 0, 0],
      maxColor: [255, 0, 0, 255]
    },
    backgroundColor: [0, 0, 255, 0],
    geoHashStyle: {
      style: 'geohash',
      sr: '102100'
    },
    featureRenderer: {
      type: 'simple',
      symbol: {
        type: 'esriSMS',
        style: 'esriSMSCircle',
        color: [255, 0, 0, 255],
        size: 1,
        angle: 0,
        xoffset: 0,
        yoffset: 0,
        outline: {
          color: [0, 0, 0, 255],
          width: 1
        }
      },
      label: '',
      description: ''
    }
  }
}
