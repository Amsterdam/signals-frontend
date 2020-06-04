import React from 'react';
import { shallow } from 'enzyme';
import TextArea from 'components/TextArea';

import DescriptionWithClassificationInput from './index';

describe('Form component <DescriptionWithClassificationInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    placeholder: 'type here',
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
        getClassification: jest.fn(),
      },
    };

    wrapper = shallow(
      <DescriptionWithClassificationInput
        handler={handler}
        parent={parent}
        touched={touched}
        hasError={hasError}
        getError={getError}
      />
    );
  });

  describe('rendering', () => {
    it('should render classification text area field correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no classification text area field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false,
        },
      });

      expect(handler).not.toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render with a character counter when maxLength is supplied correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          maxLength: 3000,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render with a character counter with value correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          maxLength: 3000,
        },
        value: 'test',
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
          isVisible: true,
        },
      });

      wrapper.find(TextArea).simulate('blur', event);
      expect(parent.meta.getClassification).toHaveBeenCalledWith('diabolo');
      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo',
      });
    });

    it('doesn\'t call the predictions for empty values', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      wrapper.find(TextArea).simulate('blur', { target: { value: '' } });
      expect(parent.meta.getClassification).not.toHaveBeenCalled();
      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': '',
      });
    });
  });
});
