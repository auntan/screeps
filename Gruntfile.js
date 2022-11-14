module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'spawn273@mail.ru',
                token: 'fabd5ccf-44d2-42d7-bb3a-c4c5c0b7f42e',
                branch: 'default',
                //server: 'season'
            },
            dist: {
                src: ['src/*.js']
            }
        }
    });
}
