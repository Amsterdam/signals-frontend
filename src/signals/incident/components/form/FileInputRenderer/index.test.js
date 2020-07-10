import React from 'react';
import { shallow } from 'enzyme';

import FileInputRenderer from '.';

describe('Form component <FileInputRenderer />', () => {
  const metaFields = {
    name: 'input-field-name',
  };
  const parentControls = {
    'input-field-name': {
      updateValueAndValidity: jest.fn(),
    },
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
      },
      value: jest.fn(),
      controls: parentControls,
    };

    wrapper = shallow(
      <FileInputRenderer
        handler={handler}
        parent={parent}
        touched={touched}
        hasError={hasError}
        getError={getError}
      />
    );
  });

  describe('rendering', () => {
    it('should render upload field correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          maxNumberOfFiles: 3,
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render upload field with one uploaded file and one loading correctly', () => {
      parent.value = {
        'input-field-name_previews': [
          'blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c',
          'loading-42',
        ],
      };
      wrapper.setProps({
        meta: {
          ...metaFields,
          maxNumberOfFiles: 2,
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render upload field with multiple errors correctly', () => {
      parent.value = {
        'input-field-name_errors': [
          'Dit bestand is te groot. De maximale bestandgrootte is 976,6 kB.',
          'Dit bestandstype wordt niet ondersteund. Toegestaan zijn: jpeg.',
          'U kunt maximaal 3 bestanden uploaden.',
        ],
      };
      wrapper.setProps({
        meta: {
          ...metaFields,
          maxNumberOfFiles: 3,
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no upload field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          maxNumberOfFiles: 3,
          isVisible: false,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });
  });
});
