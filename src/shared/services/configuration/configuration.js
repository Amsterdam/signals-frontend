import globalConfig from 'globalConfig'; // eslint-disable-line import/extensions, import/no-unresolved

const domainName = 'meldingen.amsterdam.nl';
const apiDomainName = 'api.data.amsterdam.nl';

export class Configuration {
  constructor(host) {
    this.hostname = host || (window && window.location && window.location.hostname);
    this.config = {};
    this.setConfig();
    this.loadGlobalConfig();
  }

  setConfig() {
    let config;

    if (this.hostname === domainName) {
      config = {
        API_ROOT: `https://${apiDomainName}/`,
        ROOT: `https://${this.hostname}/`,
        AUTH_ROOT: `https://${apiDomainName}/`,
        API_ROOT_MLTOOL: `https://${apiDomainName}/`,
      };
    } else if (this.hostname === `acc.${domainName}`) {
      config = {
        API_ROOT: `https://acc.${apiDomainName}/`,
        ROOT: `https://${this.hostname}/`,
        AUTH_ROOT: `https://acc.${apiDomainName}/`,
        API_ROOT_MLTOOL: `https://acc.${apiDomainName}/`,
      };
    } else if (this.hostname === `opleiding.${domainName}`) {
      config = {
        API_ROOT: `https://api.opleiding.${domainName}/`,
        ROOT: `https://${this.hostname}/`,
        AUTH_ROOT: `https://acc.${apiDomainName}/`,
        API_ROOT_MLTOOL: `https://api.opleiding.${domainName}/`,
      };
    } else {
      config = {
        API_ROOT: `https://acc.${apiDomainName}/`,
        ROOT: 'http://localhost:3001/',
        AUTH_ROOT: 'https://acc.api.data.amsterdam.nl/',
        API_ROOT_MLTOOL: `https://acc.${apiDomainName}/`
      };
    }

    this.config = config;
  }

  loadGlobalConfig() {
    /* istanbul ignore next */
    if (globalConfig) {
      this.config = {
        ...this.config,
        ...globalConfig
      };
    }
  }

  get API_ROOT() {
    return this.config.API_ROOT;
  }

  get ROOT() {
    return this.config.ROOT;
  }

  get AUTH_ROOT() {
    return this.config.AUTH_ROOT;
  }

  get API_ROOT_MLTOOL() {
    return this.config.API_ROOT_MLTOOL;
  }
}

const CONFIGURATION = new Configuration();

export default CONFIGURATION;
