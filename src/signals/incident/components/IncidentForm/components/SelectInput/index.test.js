import React from 'react';
import { shallow } from 'enzyme';

import TextInput from './index';

jest.mock('../Title/', () => 'Title');
jest.mock('../ErrorMessage/', () => 'ErrorMessage');

describe('Form component <TextInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    placeholder: 'type here',
    values: {
      foo: 'foo',
      bar: 'bar',
      baz: 'baz'
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

    handler.mockImplementation(() => ({ value: 'bar' }));

    wrapper = shallow(<TextInput
      handler={handler}
      parent={parent}
      touched={touched}
      hasError={hasError}
      getError={getError}
    />);
  });

  describe('rendering', () => {
    it('should render select field correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          ifVisible: true
        }
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render empty select field when options are not supplied', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          ifVisible: true,
          values: undefined
        }
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no select field when not visible', () => {
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
    const event = { target: { value: 'baz' } };

    it('sets incident when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          ifVisible: true,
          updateIncident: true
        }
      });

      wrapper.find('select').simulate('change', event);

      expect(parent.meta.setIncident).toHaveBeenCalledWith({
        'input-field-name': 'baz'
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

      wrapper.find('select').simulate('change', event);

      expect(parent.meta.setIncident).not.toHaveBeenCalled();
    });
  });
});
