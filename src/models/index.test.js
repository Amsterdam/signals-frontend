import loadIncidentModel from './incident';

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

  it('should load incident model', () => {
    loadIncidentModel.mockImplementation(spy);
    loadModels(store);

    expect(spy).toHaveBeenCalledWith(store);
  });
});
