const JSDOMEnvironment = require('jest-environment-jsdom');
const L = require('leaflet-headless');

module.exports = class JSDOMEnvironmentGlobal extends JSDOMEnvironment {
  setup() {
    this.global.window.L = L;
  }
};
