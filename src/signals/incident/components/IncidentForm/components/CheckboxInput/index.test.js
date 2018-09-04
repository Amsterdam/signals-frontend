import React from 'react';
import { shallow } from 'enzyme';

import CheckboxInput from './index';

jest.mock('../Title/', () => 'Title');
jest.mock('../ErrorMessage/', () => 'ErrorMessage');

describe('Form component <CheckboxInput />', () => {
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

    wrapper = shallow(<CheckboxInput
      handler={handler}
      parent={parent}
      touched={touched}
      hasError={hasError}
      getError={getError}
    />);
  });

  describe('rendering', () => {
    it('should render checkbox correctly', () => {
      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          isVisible: true
        }
      });

      expect(handler).toHaveBeenCalledWith('checkbox');
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no checkbox when not visible', () => {
      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          isVisible: false
        }
      });

      expect(handler).not.toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('can be checked and unchecked', () => {
      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          isVisible: true,
          updateIncident: true
        }
      });

      const checkEevent = { target: { checked: true } };
      wrapper.find('input').simulate('click', checkEevent);

      expect(parent.meta.setIncident).toHaveBeenCalledWith({
        'input-field-name': true
      });

      const uncheckEevent = { target: { checked: false } };
      wrapper.find('input').simulate('click', uncheckEevent);

      expect(parent.meta.setIncident).toHaveBeenCalledWith({
        'input-field-name': false
      });
    });
  });
});
