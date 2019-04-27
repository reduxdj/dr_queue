###Authentication - Roll Your Own

An example middleware has been included which can be implemented with
Redis or your database, another good way to setup authentication is with
a JWT token, which can be placed into the header, to find out more about
JWT See: [tokens][https://jwt.io/introduction/]

In our examples we use a simple Bearer token example, please change
the token logic in your config to meet your needs.

```
"credentials" : {
  "token" : "Go"
}
```

We plan to add support directly for Redis authentication. However, we don't support
this type of setup yet. We believe the preferred way to handle Redis security, is
only through the backend of your apps at the app level.

For example, We use a VPN for all our servers, and find
that taking any authentication duties away from Redis as authentication
is done best at the infrastructure level.

See: [(Roadmap)](https://github.com/reduxdj/dr_queue/blob/master/ROADMAP.md)
