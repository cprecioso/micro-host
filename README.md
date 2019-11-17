# `micro-host`

Adapted the
[`express.js` algorithm](https://github.com/expressjs/express/blob/b8e50568af9c73ef1ade434e92c60d389868361d/lib/request.js#L427)
to a [`micro`](https://github.com/zeit/micro) middleware.

## Installation

```sh
$ npm install micro-host
```

## Example

```js
import host from "micro-host"

export default host(
  async (req, res) => {
    console.log(req.host) // -> "localhost:3000", or "my-deploy.now.sh", etc
  },
  {
    trustProxy: true
    // (Optional - default `false`) Whether to trust the X-Forwarded-Host if
    // you use a reverse proxy. You can also pass a function that accepts
    // `req.connection.remoteAddress` and returns a boolean whether to trust
    // it.
  }
)
```

If you don't use a bundler or ES module, you can import like

```js
const host = require("micro-host").default
```
