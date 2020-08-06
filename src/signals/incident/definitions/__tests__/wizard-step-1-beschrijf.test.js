import step1 from '../wizard-step-1-beschrijf';

const { formFactory } = step1;

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

describe('Wizard step 1 beschrijf, formFactory', () => {
  it('should return sources', () => {
    const actual = formFactory({}, sources);

    expect(actual.controls.source.meta.values).toEqual(expectedSources);
  });

  it('should alway return the same as the first time', () => {
    const expected = formFactory({}, sources);
    const actual1 = formFactory({}, sources);
    const actual2 = formFactory({}, []);

    expect(actual1).toBe(expected);
    expect(actual2).toBe(expected);
  });
});
