# grunt-broccoli

Allows you to execute your Broccoli configurations as Grunt tasks. [Broccoli](https://github.com/joliss/broccoli) is an asset pipeline that allows for incremental builds. Broccoli rebuilds individual files instead of the entire project as Grunt watch does. Checkout the [Broccoli Sample App](https://github.com/joliss/broccoli-sample-app).

## Build in tasks

Built in tasks ```broccoli:serve``` && ```broccoli:build:{outputDir}``` look for Broccoli.js in working directory and execute it.

### broccoli:build:{outputDir}

If you don't specify {outputDir} directory, then it will write to default **build** directory.

### broccoli:serve

Start Broccoli server.

## Custom Tasks

### broccoli:{customTaskName}:build

Build Broccoli output

### broccoli:{customTaskName}:serve

Serve your Broccoli output

```javascript
broccoli: {

      withFunction: {
        // method bound to task
        config: brocFunction
        src: 'examples',
        dest: 'output'
      },

      withRequire: {
        options: {
          config: require('./examples/Brocfile2')
        },
        src: 'examples',
        dest: 'output'
      },

      withArray: {
        options: {
          config: [ './examples/Brocfile.js', brocFunction, require('./examples/Brocfile2') ]
        },
        src: 'examples',
        dest: 'output'
      }

    }

  });

  function brocFunction(broccoli) {

    var tree = this.data.src;

    return tree;
  }
```
