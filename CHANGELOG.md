# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.0] - 2016-12-09
### Added
* command `prepare` to prepare a definition and data source
* Function to generate Geoevent definition from Socrata view
* Function to generate slurp configuration from Socrata view
* Slurp command can use a configuration file

### Changed
* Reorganized into commands directory

### Fixed
* ObjectIDs are properly assigned
* Removed duplicate code from index.js
* Bug where csv rows could be parsed incorrectly into values

## [1.0.0] - 2016-12-07
* Initial Release

[1.1.0]: https://github.com/dmfenton/fatstraw/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/dmfenton/fatstraw/releases/tag/v1.0.0
