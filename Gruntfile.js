module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			less: {
				files: ['less/*.less'],
				tasks: ['less'],
				options: {
					spawn: false
				},
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
			},
			build: {
				files: {
					'dist/mywidearea.min.js': ['js/mywidearea.js'],
				}
			}
		},
		copy: {
			mywidearea: {
				src: 'js/mywidearea.js',
				dest: 'dist/mywidearea.js'
			},
		},
		less: {
			development: {
				options: {
					// allow to import easily bootstrap less libs
					paths: ["bower_components/bootstrap/less"]
				},
				files: {
					"dist/mywidearea.css": "less/mywidearea.less"
				}
			},
		},
		cssmin: {
			minify: {
				files: {
					'dist/mywidearea.min.css': ['dist/mywidearea.css'],
				}
			}
		}
	});

	// load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// register tasks
	grunt.registerTask('build', [
		'uglify',
		'cssmin',
		'copy'
	]);
	
	grunt.registerTask('default', ['build']);

};