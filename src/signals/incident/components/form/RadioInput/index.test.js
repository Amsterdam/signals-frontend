import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';

import { _RadioInput as RadioInput } from './index';

describe('Form component <RadioInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    placeholder: 'type here',
    values: {
      foo: 'Foo',
      bar: 'Bar'
    }
  };
  let wrapper;
  let handler;
  let touched;
  let getError;
  let hasError;
  let parent;

  beforeEach(() => {
    handler = jest.fn();
    touched = false;
    getError = jest.fn();
    hasError = jest.fn();
    parent = {
      meta: {
        updateIncident: jest.fn()
      }
    };

    const messages = {
      'melding.questions.extra_something.overig': 'overig message'
    };
    const intlProvider = new IntlProvider({ locale: 'nl', messages }, {});
    const { intl } = intlProvider.getChildContext();

    wrapper = shallow(<RadioInput
      handler={handler}
      parent={parent}
      touched={touched}
      hasError={hasError}
      getError={getError}
      intl={intl}
    />);

    handler.mockImplementation(() => ({
      value: {
        id: 'foo',
        label: 'Foo'
      }
    }));
  });

  describe('rendering', () => {
    it('should render radio fields correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render zero radio fields when values are not supplied', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          values: undefined
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no radio field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('should use translation for radio label and value if available', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          values: {
            foo: {
              id: 'melding.questions.extra_something.overig',
              defaultMessage: 'Overig default'
            }
          }
        }
      });

      expect(wrapper.find('.antwoord').text()).toBe('overig message');
    });
  });

  describe('events', () => {
    const event = { target: { value: 'foo' } };

    it('sets incident when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      wrapper.find('input').first().simulate('change', event);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': {
          id: 'foo',
          label: 'Foo'
        }
      });
    });

    it('sets the translation value if using translation', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          values: {
            foo: {
              id: 'melding.questions.extra_something.overig',
              defaultMessage: 'Overig default'
            }
          }
        }
      });

      wrapper.find('input').first().simulate('change', event);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': {
          id: 'foo',
          label: 'overig message'
        }
      });
    });
  });
});
