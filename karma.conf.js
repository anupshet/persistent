// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-parallel')
    ],
    parallelOptions: {
        executors: 1,
        shardStrategy: 'round-robin'
    },
    client:{
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false
      }
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    files: [
     // './src/assets/scripts/read-json.js',
      // {pattern: './src/test.ts', watched: false},
      {pattern: './src/assets/i18n/*.json', included: false}
    ],
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--remote-debugging-port=9222',
        ]
      }
    },
    browsers: ['Chrome'],
    singleRun: false,
    browserNoActivityTimeout: 240 * 1000,
    captureTimeout: 240 * 1000
  });
};
