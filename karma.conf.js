/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

// Karma configuration
// Generated on Sat Oct 28 2017 20:10:58 GMT-0400 (EDT)
const requireJsConfig = require("./requirejsConfig");
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        client: {
            requireJsConfig: requireJsConfig
        },
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['requirejs', 'jasmine'],

        plugins: [
            require("karma-requirejs"),
            require("karma-jasmine"),
            require("karma-chrome-launcher"),
            require("karma-coverage"),
            require("karma-firefox-launcher"),
            require("karma-opera-launcher"),
            require("karma-phantomjs-launcher"),
            require("karma-safari-launcher")
        ],

        // list of files / patterns to load in the browser
        files: [
            'test-main.js',
            {pattern: 'spec/**/*.html', included: true},
            {pattern: 'public/**/*.js', included: false},
            {pattern: 'public/**/*.json', included: false},
            {pattern: 'spec/**/*.js', included: false},
            {pattern: 'spec/**/*.json', included: false},
            {pattern: 'spec/**/*_spec.js', included: false}
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: ['PhantomJS', 'Safari', 'Chrome', 'Firefox', 'Opera', 'IE'],
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
};
