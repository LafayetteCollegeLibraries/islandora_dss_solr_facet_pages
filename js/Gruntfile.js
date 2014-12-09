module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),

	    jshint: {

		all: [ 'Gruntfile.js', 'src/**/*.js' ],
		options: {

		    jquery: true
		}
		    
	    },
	    jasmine: {

		src: 'src/**/*.js',
		options: {

		    specs: 'spec/*spec.js',
		    helpers: 'spec/*helper.js',
		    vendor: [ 'http://code.jquery.com/jquery-1.7.1.js' ]
		}
	    },
	    uglify: {
		options: {
		    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		},
		build: {
		    src: 'src/<%= pkg.name %>.js',
		    dest: 'build/<%= pkg.name %>.min.js'
		}
	    }
	});

    // Load the tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);
};
