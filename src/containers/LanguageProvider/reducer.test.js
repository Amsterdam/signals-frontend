import languageProviderReducer, { initialState } from './reducer';
import { CHANGE_LOCALE } from './constants';

describe('languageProviderReducer', () => {
  it('returns the initial state', () => {
    expect(languageProviderReducer(undefined, {})).toEqual(initialState);
  });

  it('changes the locale', () => {
    expect(languageProviderReducer(undefined, { type: CHANGE_LOCALE, locale: 'en' })).toEqual({
      locale: 'en',
    });
  });
});
