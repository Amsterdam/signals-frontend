import {
  getOauthDomain,
  getAuth,
  getAccessToken,
  isAuthenticated,
  getAuthHeaders,
  authenticate,
  login,
  logout,
} from './auth';
import keycloak from './services/keycloak';
import authz from './services/authz';
import configuration from '../configuration/configuration';

jest.mock('shared/services/configuration/configuration');

describe('auth', () => {
  let savedOauthDomain;

  beforeEach(() => {
    global.localStorage.getItem.mockImplementation(key => {
      switch (key) {
        case 'oauthDomain':
          return savedOauthDomain;
        default:
          return '';
      }
    });
  });

  afterEach(() => {
    configuration.__reset();
    global.localStorage.setItem.mockReset();
    global.localStorage.removeItem.mockReset();
    jest.restoreAllMocks();
  });

  describe('getOauthDomain', () => {
    it('returns current oAuthDomain', () => {
      savedOauthDomain = 'datapunt';
      const oauthDomain = getOauthDomain();

      expect(oauthDomain).toEqual('datapunt');
    });
  });

  describe('getAuth', () => {
    it('returns keycloak instance when keycloak is the current oAuth domain', () => {
      savedOauthDomain = 'keycloak';

      expect(getAuth()).toEqual(keycloak);
    });

    it('returns authz instance when current oAuth domain is not keycloak', () => {
      savedOauthDomain = 'other';

      expect(getAuth()).toEqual(authz);
    });

    it('returns authz instance when current oAuth domain is not set', () => {
      savedOauthDomain = null;

      expect(getAuth()).toEqual(authz);
    });

    it('returns authz instance when keycloak is not configured', () => {
      delete configuration.keycloak;
      savedOauthDomain = 'keycloak';

      expect(getAuth()).toEqual(authz);
    });
  });

  describe('getAccessToken', () => {
    it('calls getAccessToken function on auth instance', () => {
      savedOauthDomain = 'keycloak';
      keycloak.getAccessToken = jest.fn();

      getAccessToken();

      expect(keycloak.getAccessToken).toHaveBeenCalled();
    });
  });

  describe('getAccessToken', () => {
    it('calls getAccessToken function on auth instance', () => {
      savedOauthDomain = 'keycloak';
      keycloak.isAuthenticated = jest.fn();

      isAuthenticated();

      expect(keycloak.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe('getAuthHeaders', () => {
    it('calls getAuthHeaders function on auth instance', () => {
      savedOauthDomain = 'keycloak';
      keycloak.getAuthHeaders = jest.fn();

      getAuthHeaders();

      expect(keycloak.getAuthHeaders).toHaveBeenCalled();
    });
  });

  describe('authenticate', () => {
    it('calls authenticate function on auth instance', () => {
      savedOauthDomain = 'keycloak';
      keycloak.authenticate = jest.fn();

      authenticate();

      expect(keycloak.authenticate).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('calls login for keycloak instance', () => {
      keycloak.login = jest.fn();
      login('keycloak');

      expect(keycloak.login).toHaveBeenCalled();
      expect(global.localStorage.setItem).toHaveBeenCalledWith('oauthDomain', 'keycloak');
    });

    it('calls login for authz instance', () => {
      authz.login = jest.fn();
      login('datapunt');

      expect(authz.login).toHaveBeenCalledWith('datapunt');
      expect(global.localStorage.setItem).toHaveBeenCalledWith('oauthDomain', 'datapunt');
    });

    it('throws when user has no storage support', () => {
      const storage = global.Storage;
      global.Storage = undefined;

      expect(login('datapunt')).rejects.toThrow('Storage not available; cannot proceed with logging in');

      global.Storage = storage;
    });
  });

  describe('logout', () => {
    it('calls logout function', () => {
      savedOauthDomain = 'keycloak';
      keycloak.logout = jest.fn();

      logout();

      expect(keycloak.logout).toHaveBeenCalled();
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('oauthDomain');
    });
  });
});
