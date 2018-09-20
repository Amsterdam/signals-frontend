import React from 'react';
import { shallow } from 'enzyme';

import DescriptionWithClassificationInput from './index';

describe('Form component <DescriptionWithClassificationInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    placeholder: 'type here'
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
        updateIncident: jest.fn(),
        getClassification: jest.fn()
      }
    };

    wrapper = shallow(<DescriptionWithClassificationInput
      handler={handler}
      parent={parent}
      touched={touched}
      hasError={hasError}
      getError={getError}
    />);
  });

  describe('rendering', () => {
    it('should render classification text area field correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no classification text area field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false
        }
      });

      expect(handler).not.toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    const event = { target: { value: 'diabolo' } };

    it('sets incident when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          updateIncident: true
        }
      });

      wrapper.find('textarea').simulate('blur', event);

      expect(parent.meta.getClassification).toHaveBeenCalledWith('diabolo');
      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo'
      });
    });

    it('does nothing when updateIncident is false', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          updateIncident: false
        }
      });

      wrapper.find('textarea').simulate('change', event);

      expect(parent.meta.getClassification).not.toHaveBeenCalled();
      expect(parent.meta.updateIncident).not.toHaveBeenCalled();
    });
  });
});
