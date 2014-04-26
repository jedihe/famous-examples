path = require('path');


module.exports = function(grunt) {
// Load Grunt tasks declared in the package.json file
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

grunt.registerTask("examplesenumerator", "generate the list of examples available", function() {
  var examples = [];

  // read all subdirectories from your examples folder
  grunt.file.expand("./src/examples/**/*.js").forEach(function (example) {
    grunt.log.writeln(example);
    examples.push(example.replace('./src/', '').replace('.js', ''));
  });
  grunt.config.set('examplesenumerator', JSON.stringify(examples));
});

// Configure Grunt
grunt.initConfig({

// Grunt express - our webserver
// https://github.com/blai/grunt-express
express: {
    server: {
        options: {
            bases: path.resolve('.'),
            port: 8080,
            hostname: "0.0.0.0",
            livereload: true
        }
    }
},

processhtml: {
  dev: {
    files: {
      './index.html': ['./_index.html']
    },
    options: {
      process: true,
      data: {
        examples: '<%= examplesenumerator %>'
      }
    }
  },
  options: {
    commentMarker: 'process'
  }
},

// grunt-watch will monitor the projects files
// https://github.com/gruntjs/grunt-contrib-watch
watch: {
    all: {
            files: ['**/_*.html', 'src/*.js', 'src/examples/**/*.js'],
            tasks: ['examplesenumerator', 'processhtml'],
            options: {
                livereload: true
        }
    }
},

// grunt-open will open your browser at the project's URL
// https://www.npmjs.org/package/grunt-open
open: {
    all: {
        path: 'http://localhost:8080'
    }
}
});

// Creates the `server` task
grunt.registerTask('server', [
    'examplesenumerator',
    'processhtml',
    'express',
    'open',
    'watch'
    ]);
};
