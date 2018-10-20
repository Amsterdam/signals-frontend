// import globalConfig from 'globalConfig'; // eslint-disable-line import/extensions, import/no-unresolved

const domainName = 'meldingen.amsterdam.nl';
const apiDomainName = 'api.data.amsterdam.nl';

export class Configuration {
  constructor(host) {
    this.hostname = host || (window && window.location && window.location.hostname);

    this.setConfig();
  }

  setConfig() {
    if (this.hostname === domainName) {
      this.apiRoot = `https://${apiDomainName}/`;
      this.root = `https://${this.hostname}/`;
      this.authRoot = `https://${apiDomainName}/`;
      this.apiRootMltool = `https://${apiDomainName}/`;
    } else if (this.hostname === `acc.${domainName}`) {
      this.apiRoot = `https://acc.${apiDomainName}/`;
      this.root = `https://${this.hostname}/`;
      this.authRoot = `https://acc.${apiDomainName}/`;
      this.apiRootMltool = `https://acc.${apiDomainName}/`;
    } else if (this.hostname === `opleiding.${domainName}`) {
      this.apiRoot = `https://api.opleiding.${domainName}/`;
      this.root = `https://${this.hostname}/`;
      this.authRoot = `https://acc.${apiDomainName}/`;
      this.apiRootMltool = `https://api.opleiding.${domainName}/`;
    } else {
      this.apiRoot = `https://acc.${apiDomainName}/`;
      this.root = 'http://localhost:3001/';
      this.authRoot = 'https://acc.api.data.amsterdam.nl/';
      this.apiRootMltool = `https://acc.${apiDomainName}/`;
    }
  }

  get API_ROOT() {
    return this.apiRoot;
  }

  get ROOT() {
    return this.root;
  }

  get AUTH_ROOT() {
    return this.authRoot;
  }

  get API_ROOT_MLTOOL() {
    return this.apiRootMltool;
  }
}

const CONFIGURATION = new Configuration();

export default CONFIGURATION;
