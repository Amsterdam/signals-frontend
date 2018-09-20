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
        setIncident: jest.fn(),
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

    it('should render with a character counter when maxLength is supplied correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          maxLength: 3000
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render with a character counter with value correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          maxLength: 3000
        },
        value: 'test'
      });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    const event = { target: { value: 'diabolo' } };

    it('sets incident when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      wrapper.find('textarea').simulate('blur', event);

      expect(parent.meta.getClassification).toHaveBeenCalledWith('diabolo');
      expect(parent.meta.setIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo'
      });
    });
  });
});
