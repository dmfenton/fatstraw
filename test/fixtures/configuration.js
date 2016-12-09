module.exports = {
  fields: [
    {
      field: 'trip_id',
      transform: 'string',
      csv: 'Trip ID'
    },
    {
      field: 'taxi_id',
      transform: 'string',
      csv: 'Taxi ID'
    },
    {
      field: 'trip_start_timestamp',
      transform: 'date',
      csv: 'Trip Start Timestamp'
    },
    {
      field: 'trip_end_timestamp',
      transform: 'date',
      csv: 'Trip End Timestamp'
    },
    {
      field: 'trip_seconds',
      transform: 'double',
      csv: 'Trip Seconds'
    },
    {
      field: 'trip_miles',
      transform: 'double',
      csv: 'Trip Miles'
    },
    {
      field: 'pickup_census_tract',
      transform: 'string',
      csv: 'Pickup Census Tract'
  	},
    {
  		field: 'dropoff_census_tract',
  		transform: 'string',
      csv: 'Dropoff Census Tract'
  	},
    {
      field: 'pickup_community_area',
      transform: 'double',
      csv: 'Pickup Community Area'
    },
    {
      field: 'dropoff_community_area',
      transform: 'double',
      csv: 'Dropoff Community Area'
    },
    {
      field: 'fare',
      transform: 'money',
      csv: 'Fare'
    },
    {
      field: 'tips',
      transform: 'money',
      csv: 'Tips'
    },
    {
      field: 'tolls',
      transform: 'money',
      csv: 'Tolls'
    },
    {
      field: 'extras',
      transform: 'money',
      csv: 'Extras'
    },
    {
      field: 'trip_total',
      transform: 'money',
      csv: 'Trip Total'
    },
    {
      field: 'payment_type',
      transform: 'string',
      csv: 'Payment Type'
    },
    {
      field: 'company',
      transform: 'string',
      csv: 'Company'
    },
    {
      field: 'pickup_centroid_latitude',
      transform: 'double',
      csv: 'Pickup Centroid Latitude'
    },
    {
      field: 'pickup_centroid_longitude',
      transform: 'double',
      csv: 'Pickup Centroid Longitude'
    },
    {
      field: 'pickup_centroid_location',
      transform: 'wktPoint',
      csv: 'Pickup Centroid Location'
    },
    {
      field: 'dropoff_centroid_latitude',
      transform: 'double',
      csv: 'Dropoff Centroid Latitude'
    },
    {
      field: 'dropoff_centroid_longitude',
      transform: 'double',
      csv: 'Dropoff Centroid Longitude'
    },
    {
      field: 'dropoff_centroid_location',
      transform: 'wktPoint',
      csv: 'Dropoff Centroid  Location'
    }
  ]
}
