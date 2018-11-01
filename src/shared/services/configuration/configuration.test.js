import globalConfig from 'globalConfig'; // eslint-disable-line import/extensions, import/no-unresolved
import CONFIGURATION, { Configuration } from './configuration';

describe('The configuration service', () => {
  it('should have CONFIGURATION instance', () => {
    expect(CONFIGURATION).toBeInstanceOf(Configuration);

    expect(CONFIGURATION).toHaveProperty('API_ROOT');
    expect(CONFIGURATION).toHaveProperty('ROOT');
    expect(CONFIGURATION).toHaveProperty('AUTH_ROOT');
    expect(CONFIGURATION).toHaveProperty('API_ROOT_MLTOOL');
  });

  it('should return DEVELOPMENT config by default ', () => {
    const config = new Configuration();

    expect(config.API_ROOT).toEqual('https://acc.api.data.amsterdam.nl/');
    expect(config.ROOT).toEqual('http://localhost:3001/');
    expect(config.AUTH_ROOT).toEqual('https://acc.api.data.amsterdam.nl/');
    expect(config.API_ROOT_MLTOOL).toEqual('https://acc.api.data.amsterdam.nl/');
  });

  it('should return PRODUCTION config', () => {
    const hostname = 'meldingen.amsterdam.nl';
    const config = new Configuration(hostname);

    expect(config.API_ROOT).toEqual('https://api.data.amsterdam.nl/');
    expect(config.ROOT).toEqual('https://meldingen.amsterdam.nl/');
    expect(config.AUTH_ROOT).toEqual('https://api.data.amsterdam.nl/');
    expect(config.API_ROOT_MLTOOL).toEqual('https://api.data.amsterdam.nl/');
  });

  it('should return ACCEPTATION config', () => {
    const hostname = 'acc.meldingen.amsterdam.nl';
    const config = new Configuration(hostname);

    expect(config.API_ROOT).toEqual('https://acc.api.data.amsterdam.nl/');
    expect(config.ROOT).toEqual('https://acc.meldingen.amsterdam.nl/');
    expect(config.AUTH_ROOT).toEqual('https://acc.api.data.amsterdam.nl/');
    expect(config.API_ROOT_MLTOOL).toEqual('https://acc.api.data.amsterdam.nl/');
  });

  it('should return OPLEIDING config', () => {
    const hostname = 'opleiding.meldingen.amsterdam.nl';
    const config = new Configuration(hostname);

    expect(config.API_ROOT).toEqual('https://api.opleiding.meldingen.amsterdam.nl/');
    expect(config.ROOT).toEqual('https://opleiding.meldingen.amsterdam.nl/');
    expect(config.AUTH_ROOT).toEqual('https://acc.api.data.amsterdam.nl/');
    expect(config.API_ROOT_MLTOOL).toEqual('https://api.opleiding.meldingen.amsterdam.nl/');
  });

  it('should return globalConfig over local config when they are defined ', () => {
    globalConfig.API_ROOT = 'https://some-other-server.nl/';
    globalConfig.ROOT = 'https://some-other-root-server.nl/';
    globalConfig.AUTH_ROOT = 'https://some-other-auth-server.nl/';
    globalConfig.API_ROOT_MLTOOL = 'https://some-other-ml-server.nl/';

    const config = new Configuration();

    expect(config.API_ROOT).toEqual('https://some-other-server.nl/');
    expect(config.ROOT).toEqual('https://some-other-root-server.nl/');
    expect(config.AUTH_ROOT).toEqual('https://some-other-auth-server.nl/');
    expect(config.API_ROOT_MLTOOL).toEqual('https://some-other-ml-server.nl/');
  });
});
