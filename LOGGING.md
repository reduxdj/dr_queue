### Logging
One of Dr. Queue's ultimate goals is helping to organize log files, and aggregate those logs using Redis.
Each log statement that Dr. Queue writes, assumes that this app might be part of a bigger system where it
can subscribe to specific Redis channels to receive real time log events, while using the queue to manage
writing these logs to disk. In the config you'll see a list of transports, currently each transport name
is converted into a log command, that also takes a path and format parameters.

```
"logs": {
  "transports":[
    {
    "name": "info", // name of logger command
    "path": "./info.log", // path to store file
    "format": "txt" //text or JSON string
  },{
    "name": "error",
    "host": "./error.log",
    "format": "txt"
  }]
},
```
Eventually Dr Queue will have separate transports for Winston, directly, that can take a redis connection, or
create its own connection, using the log address schema above.
