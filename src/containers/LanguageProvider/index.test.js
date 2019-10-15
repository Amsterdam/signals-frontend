import React from 'react';
import { shallow, mount } from 'enzyme';
import { FormattedMessage, defineMessages } from 'react-intl';
import { withIntlAppContext } from 'test/utils';

import ConnectedLanguageProvider, { LanguageProvider } from './index';

import { translationMessages } from '../../i18n';

const messages = defineMessages({
  someMessage: {
    id: 'some.id',
    defaultMessage: 'This is some default message',
    en: 'This is some en message',
  },
});

describe('<LanguageProvider />', () => {
  it('should render its children', () => {
    const children = (<h1>Test</h1>);
    const wrapper = shallow(
      <LanguageProvider messages={messages} locale="en">
        {children}
      </LanguageProvider>
    );
    expect(wrapper.contains(children)).toBe(true);
  });
});

describe('<ConnectedLanguageProvider />', () => {
  it('should render the default language messages', () => {
    const wrapper = mount(withIntlAppContext(
      <ConnectedLanguageProvider messages={translationMessages}>
        <FormattedMessage {...messages.someMessage} />
      </ConnectedLanguageProvider>
    ));
    expect(wrapper.contains(<FormattedMessage {...messages.someMessage} />)).toBe(true);
  });
});
