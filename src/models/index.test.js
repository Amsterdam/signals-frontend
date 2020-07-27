import { store } from 'test/utils';
import loadHistoryModel from './history';

import loadModels from '.';

jest.mock('./history');

describe('loadModels', () => {
  let spy;

  beforeEach(() => {
    spy = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load history model', () => {
    loadHistoryModel.mockImplementation(spy);
    loadModels(store);

    expect(spy).toHaveBeenCalledWith(store);
  });
});
