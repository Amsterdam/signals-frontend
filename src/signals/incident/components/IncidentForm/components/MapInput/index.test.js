import React from 'react';
import { shallow } from 'enzyme';

import MapInput from './index';

jest.mock('../Title/', () => 'Title');
jest.mock('../ErrorMessage/', () => 'ErrorMessage');

describe('Form component <MapInput />', () => {
  const metaFields = {
    name: 'input-field-name'
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

    handler.mockImplementation(() => ({ value: {
      geometrie: {
        type: 'Point',
        coordinates: [
          4,
          52
        ]
      }
    } }));

    wrapper = shallow(<MapInput
      handler={handler}
      parent={parent}
      touched={touched}
      hasError={hasError}
      getError={getError}
    />);
  });

  describe('rendering', () => {
    it('should render map field correctly', () => {
      handler.mockImplementation(() => ({ value: {} }));

      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no map field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false
        }
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    // const event = { target: { value: 'diabolo' } };

    // it('sets incident when value changes', () => {
    //   wrapper.setProps({
    //     meta: {
    //       ...metaFields,
    //       isVisible: true,
    //       updateIncident: true
    //     }
    //   });
    //
    //   wrapper.find('input').simulate('change', event);
    //
    //   expect(parent.meta.setIncident).toHaveBeenCalledWith({
    //     'input-field-name': 'diabolo'
    //   });
    // });
    //
    // it('does nothing when updateIncident is false', () => {
    //   wrapper.setProps({
    //     meta: {
    //       ...metaFields,
    //       isVisible: true,
    //       updateIncident: false
    //     }
    //   });
    //
    //   wrapper.find('input').simulate('change', event);
    //
    //   expect(parent.meta.setIncident).not.toHaveBeenCalled();
    // });
  });
});
