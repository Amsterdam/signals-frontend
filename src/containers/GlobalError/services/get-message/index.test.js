import getMessage from './index';

describe('The get message service', () => {
  it('should map all error messsages', () => {
    expect(getMessage('LOGIN_FAILED')).toEqual('Inloggen is niet gelukt.');
    expect(getMessage('LOGOUT_FAILED')).toEqual('Uitloggen is niet gelukt.');
    expect(getMessage('AUTHORIZE_FAILED')).toEqual('Authenticeren is niet gelukt.');
    expect(getMessage('UPLOAD_FAILED')).toEqual('Het uploaden van de foto is niet gelukt.');
    expect(getMessage('FETCH_CATEGORIES_FAILED')).toEqual('Inladen van categorieën is niet gelukt.');
    expect(getMessage('PRIORITY_FAILED')).toEqual('Het zetten van de urgentie van deze melding is niet gelukt.');
    expect(getMessage('UNKNOWN')).toEqual('Een onbekende fout heeft zich voorgedaan.');
  });
});
