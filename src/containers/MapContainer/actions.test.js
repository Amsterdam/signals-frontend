import { testActionCreator } from '../../../internals/testing/test-utils';

import {
  GET_GEO,
  SET_GEO
} from './constants';

import {
  getGeoName,
  setGeoName
} from './actions';


describe('App actions', () => {
  it('should create geo actions', () => {
    const location = 'location';
    const latlng = {};
    const payload = {
      location,
      latlng
    };
    testActionCreator(getGeoName, GET_GEO, latlng);
    testActionCreator(setGeoName, SET_GEO, payload);
  });
});
