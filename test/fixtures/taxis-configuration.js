module.exports = {
  geometry: 'pickup_centroid_location',
  fields: [
    {
      name: 'trip_id',
      transform: 'string',
      alias: 'Trip ID'
    },
    {
      name: 'taxi_id',
      transform: 'string',
      alias: 'Taxi ID'
    },
    {
      name: 'trip_start_timestamp',
      transform: 'date',
      alias: 'Trip Start Timestamp'
    },
    {
      name: 'trip_end_timestamp',
      transform: 'date',
      alias: 'Trip End Timestamp'
    },
    {
      name: 'trip_seconds',
      transform: 'double',
      alias: 'Trip Seconds'
    },
    {
      name: 'trip_miles',
      transform: 'double',
      alias: 'Trip Miles'
    },
    {
      name: 'pickup_census_tract',
      transform: 'string',
      alias: 'Pickup Census Tract'
    },
    {
      name: 'dropoff_census_tract',
      transform: 'string',
      alias: 'Dropoff Census Tract'
    },
    {
      name: 'pickup_community_area',
      transform: 'double',
      alias: 'Pickup Community Area'
    },
    {
      name: 'dropoff_community_area',
      transform: 'double',
      alias: 'Dropoff Community Area'
    },
    {
      name: 'fare',
      transform: 'money',
      alias: 'Fare'
    },
    {
      name: 'tips',
      transform: 'money',
      alias: 'Tips'
    },
    {
      name: 'tolls',
      transform: 'money',
      alias: 'Tolls'
    },
    {
      name: 'extras',
      transform: 'money',
      alias: 'Extras'
    },
    {
      name: 'trip_total',
      transform: 'money',
      alias: 'Trip Total'
    },
    {
      name: 'payment_type',
      transform: 'string',
      alias: 'Payment Type'
    },
    {
      name: 'company',
      transform: 'string',
      alias: 'Company'
    },
    {
      name: 'pickup_centroid_latitude',
      transform: 'double',
      alias: 'Pickup Centroid Latitude'
    },
    {
      name: 'pickup_centroid_longitude',
      transform: 'double',
      alias: 'Pickup Centroid Longitude'
    },
    {
      name: 'pickup_centroid_location',
      transform: 'wktPoint',
      alias: 'Pickup Centroid Location'
    },
    {
      name: 'dropoff_centroid_latitude',
      transform: 'double',
      alias: 'Dropoff Centroid Latitude'
    },
    {
      name: 'dropoff_centroid_longitude',
      transform: 'double',
      alias: 'Dropoff Centroid Longitude'
    },
    {
      name: 'dropoff_centroid_location',
      transform: 'wktPoint',
      alias: 'Dropoff Centroid  Location'
    }
  ]
}
