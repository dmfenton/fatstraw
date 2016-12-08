# Fat Straw

## Installation
`npm install -g fatstraw`
or
`yarn global add fatstraw`

## Usage
```sh
fatstraw [options]

Options:
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
  --sniff         Discover other members of the ES cluster
  --id-start      Initial ObjectID
  --help          Show help                                            [boolean]

Examples:
  fatstraw -h user:pass@bds:9220 -f
  data.csv -s parking_violations -g Shape
  -x X -y Y

Made with ♥️  by Esri DC R&D
```

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## License

[Apache 2.0](LICENSE)
