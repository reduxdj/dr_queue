### Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

##### [.0.0.3] - 2019-03-26
- Moved Logger from server to middleware
- Changed instantiation of Logger to an instance from a static class
- Finished Test runner script
- Fixed a bug around JSON parsing
- Fixed an issue with the redis_db pop signature

##### [.0.0.5] - 2019-03-26
- Fixed an issue where the range command was not giving the results correctly
- Fixed some documentation typos
- Updated roadmap to account for bug fix release
- Removed extraneous async methods

##### [.0.0.6] - 2019-04-26
- Added publisher/subscribe routes and scripts
- Added documentation for publish/subscribe
- Added tests for publish functions
- Fixed some documentation typos
- Changed roadmap estimations based on availability

##### [.0.0.7] - 2019-04-27
- Added Fix a configuration issue for exporting logger as middleware
- Fixed an issue with documentation typo

##### [.0.0.8] - 2019-04-29
- Added middleware instance creation

##### [.0.0.9] - 2019-04-29
- Cleaned up examples, initializing examples for exported modules was wrong
- Added images

##### [.0.1.0] - 2019-04-30
- Corrected undefined exports
- Added support for wild card pattern matching for subscription events
- Moved documentation to documentation folder

##### [.0.1.1] - 2019-04-30
- Documentation fixes

##### [.0.1.2] - 2019-05-01
- Added formatters as an optional item to Logger initialization
- Added tests for logger
- Added request url, ip and query params to logging functions for Koa middleware
