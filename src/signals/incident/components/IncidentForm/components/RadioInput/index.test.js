import React from 'react';
import { shallow } from 'enzyme';

import RadioInput from './index';

jest.mock('../Title/', () => 'Title');
jest.mock('../ErrorMessage/', () => 'ErrorMessage');

describe('Form component <RadioInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    placeholder: 'type here',
    values: {
      foo: 'foo',
      bar: 'bar'
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
        setIncident: jest.fn()
      }
    };

    wrapper = shallow(<RadioInput
      handler={handler}
      parent={parent}
      touched={touched}
      hasError={hasError}
      getError={getError}
    />);
  });

  describe('rendering', () => {
    it('should render radio fields correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          ifVisible: true
        }
      });

      expect(handler).toHaveBeenCalledWith('radio', 'foo');
      expect(handler).toHaveBeenCalledWith('radio', 'bar');
      expect(wrapper).toMatchSnapshot();
    });

    it('should render zero radio fields when values are not supplied', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          ifVisible: true,
          values: undefined
        }
      });

      expect(handler).not.toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no radio field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          ifVisible: false
        }
      });

      expect(handler).not.toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    const event = { target: { value: 'foo' } };

    it('sets incident when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          ifVisible: true,
          updateIncident: true
        }
      });

      wrapper.find('input').first().simulate('click', event);

      expect(parent.meta.setIncident).toHaveBeenCalledWith({
        'input-field-name': 'foo'
      });
    });

    it('does nothing when updateIncident is false', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          ifVisible: true,
          updateIncident: false
        }
      });

      wrapper.find('input').first().simulate('click', event);

      expect(parent.meta.setIncident).not.toHaveBeenCalled();
    });
  });
});
