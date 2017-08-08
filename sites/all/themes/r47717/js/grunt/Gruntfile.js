module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          //style: 'compressed'
        },
        files: {
          '../../css/main.css': '../../css/main.sass'
        }
      }
    },

    coffee: {
      compile: {
        expand: true,
        flatten: true,
        src: ['../*.coffee'],
        dest: '..',
        ext: '.js'
      }
    },

    uglify: {
      options: {
      	mangle: false
      },
      build: {
      	files: {
      	  '../min/main.min.js': ["../*.js"]
      	}
      }
    },

    sftp: {
      js: {
        files: {
          "./": "../min/main.min.js"
        },
        options: {
          path: '/home/r/r47717/delo/public_html/sites/all/themes/r47717/js/min',
          host: 'bane.beget.ru',
          username: 'r47717',
          password: 'PupsikINT1_',
          showProgress: true
        }
      },
      css: {
        files: {
          "./": "../../css/main.css"
        },
        options: {
          path: '/home/r/r47717/delo/public_html/sites/all/themes/r47717/js/grunt',
          host: 'bane.beget.ru',
          username: 'r47717',
          password: 'PupsikINT1_',
          showProgress: true
        }
      }
    },

    watch: {
      coffee: {
        files: ['../*.coffee'],
        tasks: ['coffee', 'uglify', 'sftp:js'],
        options: {
          spawn: false,
        },
      },
      js: {
        files: ['../*.js'],
        tasks: ['uglify', 'sftp:js'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['../../css/*.sass'],
        tasks: ['sass', 'sftp:css'],
        options: {
          spawn: false,
        },
      },
    },

  });

  grunt.registerTask('email', function() {
    var Email = require('email').Email;

    var msg = new Email({ 
      from: "mchr@yandex.ru", 
      to:   "mchr@yandex.ru",
      subject: "Grunt report", 
      body: "Build is ready"
    });

    msg.send(function(err){
      grunt.log.writeln('error sending email: ' + err);
    });

    grunt.log.writeln('email report sent');

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass', 'coffee', 'uglify', 'sftp']);

};