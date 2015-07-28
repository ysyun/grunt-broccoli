
# [grunt](https://github.com/gruntjs/grunt)-[broccoli](https://github.com/joliss/broccoli)

> Grunt task to manage your Broccoli workflow

Looking for pre 1.0 docs? They can be found [here](https://github.com/quandl/grunt-broccoli/tree/a74bed5f19ba1625bd155e93f3ba907acc75bd4d).

## Install

```
$ npm install --save-dev grunt-broccoli
```


## Usage

```js
grunt.initConfig({
  broccoli: {
    development: {
      dir: 'build',
      env: 'development',
      liveReload: true,
      serverScript: 'app.js'
    },
  }
});
```


## Options

##### dir
Type: `string` *Required*

Path to build into.

##### env
Type: `string` *Optional*

Value for `BROCCOLI_ENV` when building. Defaults to `development`.

Defaults to `development`


##### watcherClass
Type: `class` *Optional*

Alternative class to use for the broccoli file watcher, such as [broccoli-sane-watcher](https://github.com/krisselden/broccoli-sane-watcher).

Defaults to [the watcher included with broccoli](https://github.com/broccolijs/broccoli/blob/master/lib/watcher.js).

##### watcherOptions

Type: `object` *Optional*

Options to pass in to the watcher class on instantiation.

Defaults to `{}`

##### liveReload

Type: `boolean` *Optional*

Start a [live reload](https://github.com/mklabs/tiny-lr) server.

Defaults to `false`

##### liveReloadPort

Type: `number` *Optional*

Port for the live reload server to listen on.

Defaults to `35729`

##### serverScript

Type: `string`

Path to a script that starts a node http server. If set, the server will
automatically restart after successful broccoli builds. If set with the
`liveReload` option, live reload triggers will happen after the server
restarts.

To enable this, you must pass your server to the `grunt-broccoli` connect
function so that `grunt` and your server can communicate. For example:

```js
var http = require("http");
var server = http.createServer();
var GruntBroccoli = require('grunt-broccoli');

GruntBroccoli.connect(server);

server.listen(3000);
```

## License

MIT


