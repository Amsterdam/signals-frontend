import { IntlProvider } from 'react-intl';
import formatIncidentMessage from './index';

describe('format incident message', () => {
  // Create IntlProvider to retrieve React Intl context
  const initIntlProvider = (messages = {}, locale = 'nl') => {
    const intlProvider = new IntlProvider({ locale, messages }, {});
    const { intl } = intlProvider.getChildContext();
    return intl;
  };

  it('should return a simple label', () => {
    const intl = initIntlProvider();
    expect(formatIncidentMessage(intl, 'foo', {})).toBe('foo');
  });

  it('should describe a normal message', () => {
    const intl = initIntlProvider({ foo: 'my message {abc}' });
    const messageDescriptor = {
      id: 'foo',
      defaultMessage: 'bar'
    };
    expect(formatIncidentMessage(intl, messageDescriptor, { abc: 'xyz' })).toBe('my message xyz');
  });

  it('should throw an error on an invalid value', () => {
    const intl = initIntlProvider();
    const funcCall = () => formatIncidentMessage(intl, undefined, undefined);
    expect(funcCall).toThrow();
  });
});
