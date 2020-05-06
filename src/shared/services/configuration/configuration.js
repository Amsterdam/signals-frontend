import globalConfig from 'globalConfig'; // eslint-disable-line import/extensions, import/no-unresolved

const domainName = 'meldingen.amsterdam.nl';
const apiDomainName = 'api.data.amsterdam.nl';
const mapserverDomainName = 'map.data.amsterdam.nl';

export const OVL_KLOKKEN_LAYER =
  'maps/openbare_verlichting?REQUEST=GetFeature&SERVICE=wfs&OUTPUTFORMAT=application/json;%20subtype=geojson;%20charset=utf-8&Typename=Klokken&version=1.1.0&srsname=urn:ogc:def:crs:EPSG::4326';
export const OVL_VERLICHTING_LAYER =
  'maps/openbare_verlichting?REQUEST=GetFeature&SERVICE=wfs&OUTPUTFORMAT=application/json;%20subtype=geojson;%20charset=utf-8&Typename=Verlichting&version=1.1.0&srsname=urn:ogc:def:crs:EPSG::4326';

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
        API_ROOT_MAPSERVER: `https://${mapserverDomainName}/`,
      };
    } else if (this.hostname === `acc.${domainName}`) {
      config = {
        API_ROOT: `https://acc.${apiDomainName}/`,
        ROOT: `https://${this.hostname}/`,
        AUTH_ROOT: `https://acc.${apiDomainName}/`,
        API_ROOT_MLTOOL: `https://acc.${apiDomainName}/`,
        API_ROOT_MAPSERVER: `https://${mapserverDomainName}/`,
      };
    } else if (this.hostname === `opleiding.${domainName}`) {
      config = {
        API_ROOT: `https://api.opleiding.${domainName}/`,
        ROOT: `https://${this.hostname}/`,
        AUTH_ROOT: `https://acc.${apiDomainName}/`,
        API_ROOT_MLTOOL: `https://api.opleiding.${domainName}/`,
        API_ROOT_MAPSERVER: `https://${mapserverDomainName}/`,
      };
    } else {
      config = {
        API_ROOT: `https://acc.${apiDomainName}/`,
        ROOT: 'http://localhost:3001/',
        AUTH_ROOT: 'https://acc.api.data.amsterdam.nl/',
        API_ROOT_MLTOOL: `https://acc.${apiDomainName}/`,
        API_ROOT_MAPSERVER: `https://${mapserverDomainName}/`,
      };
    }

    this.config = config;
  }

  loadGlobalConfig() {
    const envConfig = globalConfig || {};
    const deployConfig = (window && window.CONFIG) || {};
    this.config = {
      ...this.config,
      ...envConfig,
      ...deployConfig,
    };
  }

  get all() {
    return this.config;
  }

  get USERS_ENDPOINT() {
    return `${this.config.API_ROOT}signals/v1/private/users/`;
  }

  get ROLES_ENDPOINT() {
    return `${this.config.API_ROOT}signals/v1/private/roles/`;
  }

  get PERMISSIONS_ENDPOINT() {
    return `${this.config.API_ROOT}signals/v1/private/permissions/`;
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

  get API_ROOT_MAPSERVER() {
    return this.config.API_ROOT_MAPSERVER;
  }

  get SEARCH_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/private/search`;
  }

  get PREDICTION_ENDPOINT() {
    return `${this.API_ROOT}signals/category/prediction`;
  }

  get INCIDENT_PUBLIC_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/public/signals/`;
  }

  get INCIDENT_PRIVATE_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/private/signals/`;
  }

  get INCIDENTS_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/private/signals/`;
  }

  get GEOGRAPHY_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/private/signals/geography`;
  }

  get PRIORITY_ENDPOINT() {
    return `${this.API_ROOT}signals/auth/priority/`;
  }

  get FEEDBACK_STANDARD_ANSWERS_ENDPOINT() {
    return `${this.API_ROOT_MLTOOL}signals/v1/public/feedback/standard_answers/`;
  }

  get FEEDBACK_FORMS_ENDPOINT() {
    return `${this.API_ROOT_MLTOOL}signals/v1/public/feedback/forms/`;
  }

  get AUTH_ME_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/private/me/`;
  }

  get CATEGORIES_PRIVATE_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/private/categories/`;
  }

  get CATEGORIES_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/public/terms/categories/`;
  }

  get TERMS_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/private/terms/categories/`;
  }

  get IMAGE_ENDPOINT() {
    return `${this.API_ROOT}signals/signal/image/`;
  }

  get FILTERS_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/private/me/filters/`;
  }

  get DEPARTMENTS_ENDPOINT() {
    return `${this.API_ROOT}signals/v1/private/departments/`;
  }
}

const CONFIGURATION = new Configuration();

export default CONFIGURATION;
