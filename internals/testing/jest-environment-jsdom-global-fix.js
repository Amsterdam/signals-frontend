const JSDOMEnvironment = require('jest-environment-jsdom');
const L = require('leaflet-headless');

module.exports = class JSDOMEnvironmentGlobal extends JSDOMEnvironment {
  constructor(config) {
    super(config);

    this.global.jsdom = this.dom;
    this.global.window.L = L;
  }

  teardown() {
    this.global.jsdom = null;

    return super.teardown();
  }

  dispose() {
    this.teardown();
  }
};
