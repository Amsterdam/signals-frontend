import { store } from 'test/utils';
import loadIncidentModel from './incident';
import loadHistoryModel from './history';

import loadModels from '.';

jest.mock('./incident');
jest.mock('./history');

describe('loadModels', () => {
  let spy;

  beforeEach(() => {
    spy = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load incident model', () => {
    loadIncidentModel.mockImplementation(spy);
    loadModels(store);

    expect(spy).toHaveBeenCalledWith(store);
  });

  it('should load history model', () => {
    loadHistoryModel.mockImplementation(spy);
    loadModels(store);

    expect(spy).toHaveBeenCalledWith(store);
  });
});
