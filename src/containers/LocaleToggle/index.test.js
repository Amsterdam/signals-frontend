import React from 'react';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router-dom';
import { shallow, mount } from 'enzyme';

import ConnectedLocaleToggle, { mapDispatchToProps, LocaleToggle } from './index';
import { changeLocale } from '../LanguageProvider/actions';
import LanguageProvider from '../LanguageProvider';

import configureStore from '../../configureStore';
import { translationMessages } from '../../i18n';

describe('<LocaleToggle />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the default language messages', () => {
    const props = { locale: 'nl' };
    const renderedComponent = shallow(
      <LocaleToggle {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should render the language messages', () => {
    const props = { locale: 'en' };
    const renderedComponent = shallow(
      <LocaleToggle {...props} />
    );
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should toggle the nl language when clicked', () => {
    const props = { locale: 'en', onLocaleToggle: jest.fn() };
    const renderedComponent = shallow(
      <LocaleToggle {...props} />
    );
    renderedComponent.find('a').simulate('click');
    expect(props.onLocaleToggle).toHaveBeenCalledWith('nl');
  });

  it('should toggle the en language when clicked', () => {
    const props = { locale: 'nl', onLocaleToggle: jest.fn() };
    const renderedComponent = shallow(
      <LocaleToggle {...props} />
    );
    renderedComponent.find('a').simulate('click');
    expect(props.onLocaleToggle).toHaveBeenCalledWith('en');
  });

  it('should present the default `nl` dutch language option', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <ConnectedLocaleToggle />
        </LanguageProvider>
      </Provider>
    );

    expect(renderedComponent.contains(<span className="linklabel">English</span>)).toBe(true);
  });

  describe('mapDispatchToProps', () => {
    describe('onLocaleToggle', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onLocaleToggle).toBeDefined();
      });

      it('should dispatch changeLocale when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const locale = 'nl';
        result.onLocaleToggle(locale);
        expect(dispatch).toHaveBeenCalledWith(changeLocale(locale));
      });
    });
  });
});
