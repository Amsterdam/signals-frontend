import loadIncidentModel from './incident';
import loadHistoryModel from './history';

import loadModels from './index';

jest.mock('./incident');

describe('loadModels', () => {
  const store = { foo: 'bar' };
  let spy;

  beforeEach(() => {
    spy = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.skip('should load incident model', () => {
    loadIncidentModel.mockImplementation(spy);
    loadModels(store);

    expect(spy).toHaveBeenCalledWith(store);
  });

  it.skip('should load history model', () => {
    loadHistoryModel.mockImplementation(spy);
    loadModels(store);

    expect(spy).toHaveBeenCalledWith(store);
  });
});
