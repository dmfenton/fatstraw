# Fat Straw

## Installation
`npm install -g fatstraw`
or
`yarn global add fatstraw`

- To import data from Esri File GeoDatabases, [GDAL must be installed](http://trac.osgeo.org/gdal/wiki/DownloadingGdalBinaries).

## Usage
```sh
fatstraw <cmd> [options]

Commands:
  slurp    load data
  prepare  prepare a dataset

Options:
  --help  Show help                                                    [boolean]

Made with ♥️  by Esri DC R&D
```

## Commands

These commands work with CSVs, Socrata Datasets and File GeoDatabases.

### Prepare: create a service in the BDS
```sh
fatstraw prepare

Options:
  --help          Show help                                            [boolean]
  -d, --dataset   The source dataset                                  [required]
  -t, --token     An authorization token                              [required]
  -u, --user      GeoEvent User                                       [required]
  -p, --password  GeoEvent Password
  -l, --layer     Layer in GeoDatabase
  -s, --server    GeoEvent server                                     [required]
```

### Slurp: load data into BDS

```sh
fatstraw slurp

Options:
  --help          Show help                                            [boolean]
  -f, --file      The CSV to load into the BDS                        [required]
  -h, --host      user:pass@bds-url:9220                              [required]
  -s, --service   The name of the BDS service to be loaded            [required]
  -g, --geometry  Field containing geometry data in BDS service
  -r, --rate      Max features per second to load                [default: 1000]
  -b, --batch     Max features to load per request               [default: 1000]
  -x, --lon       Field containing longitude data
  -y, --lat       Field containing latitude data
  --skip          How many rows to skip from the source
  --dry-run       Show payload but do not send to ES
  --delimiter     Character used to delimit CSV fields
  --sniff         Discover other members of the ES cluster
  --id-start      Initial ObjectID

Examples:
  fatstraw slurp -h user:pass@bds:9220 -f
  data.csv -s parking_violations -g Shape
  -x X -y Y
```

## Limitations
- A token must be passed into the prepare command. It can be found by logging into GeoEvent Server and viewing web traffic with browser development tools
- A direct connection to the ArcGIS SpatioTemporal Datastore is required. The user/pass can be retrieved by running the `listManagedUsers` utility on the server running the Datastore

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## License

[Apache 2.0](LICENSE)
