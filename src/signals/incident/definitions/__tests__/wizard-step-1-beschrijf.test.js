jest.mock('react-reactive-form');

const sources = [
  {
    key: 1,
    value: 'Source 1',
  },
  {
    key: 2,
    value: 'Source 2',
  },
];
const expectedSources = {
  '': 'Vul bron in',
  'Source 1': 'Source 1',
  'Source 2': 'Source 2',
};

let formFactory;

describe('Wizard step 1 beschrijf, formFactory', () => {
  beforeEach(() => {
    jest.resetModules();
    // We require the code here, to reload for each test, since the formFactory
    // function is memoized.
    // eslint-disable-next-line global-require
    formFactory = require('../wizard-step-1-beschrijf').default.formFactory;
  });

  it('should use empty array when no sources', () => {
    const actual = formFactory({}, null);

    expect(actual.controls.source.meta.values).toEqual([]);
  });

  it('should return sources', () => {
    const actual = formFactory({}, sources);

    expect(actual.controls.source.meta.values).toEqual(expectedSources);
  });

  it('should always return the same as the first time', () => {
    const expected = formFactory({}, sources);
    const actual1 = formFactory({}, sources);
    const actual2 = formFactory({}, []);

    expect(actual1).toBe(expected);
    expect(actual2).toBe(expected);
  });
});
