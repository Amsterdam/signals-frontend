import React from 'react';
import { shallow } from 'enzyme';

import FileInput from './index';

describe('Form component <FileInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    submitLabel: 'upload file'
  };
  const parentControls = {
    'input-field-name': {
      setValidators: jest.fn(),
      clearValidators: jest.fn(),
      markAsTouched: jest.fn()
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
      },
      controls: parentControls
    };

    wrapper = shallow(<FileInput
      handler={handler}
      parent={parent}
      touched={touched}
      hasError={hasError}
      getError={getError}
    />);
  });

  describe('rendering', () => {
    it('should render upload field correctly', () => {
      handler.mockImplementation(() => ({ value: undefined }));

      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render upload field with selected file correctly', () => {
      handler.mockImplementation(() => ({ value: 'blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c' }));

      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      wrapper.setProps({
        parent: {
          controls: parentControls,
          meta: {
            incident: {
              image_file: {
                type: 'image/jpeg',
                size: 666
              },
              image_type: 'image/jpeg'
            }
          },
          value: {
            image_type: 'image/jpeg'
          }

        }
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no upload field when not visible', () => {
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
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'image/jpeg' });
    let readAsText;
    let addEventListener;

    beforeEach(() => {
      readAsText = jest.fn();
      addEventListener = jest.fn((_, evtHandler) => { evtHandler(); });
      window.FileReader = jest.fn(() => ({
        addEventListener,
        readAsText,
        result: fileContents
      }));

      window.URL = {
        createObjectURL: jest.fn(),
        revokeObjectURL: jest.fn()
      };
    });

    afterEach(() => {
      delete window.URL;
    });

    it('uploads a file when and sets incident when file changes', () => {
      handler.mockImplementation(() => ({ value: undefined }));

      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      wrapper.find('input').simulate('change', { target: { files: [] } });
      expect(FileReader).not.toHaveBeenCalled();
      expect(parentControls['input-field-name'].setValidators).not.toHaveBeenCalled();
      expect(parentControls['input-field-name'].markAsTouched).not.toHaveBeenCalled();

      wrapper.find('input').simulate('change', { target: { files: [file] } });
      expect(FileReader).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
      expect(readAsText).toHaveBeenCalledWith(file);
      expect(parentControls['input-field-name'].setValidators).toHaveBeenCalled();
      expect(parentControls['input-field-name'].markAsTouched).toHaveBeenCalled();
    });

    it('resets upload when clear button was clicked', () => {
      handler.mockImplementation(() => ({ value: 'blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c' }));

      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      wrapper.find('button').simulate('click', { preventDefault: jest.fn() });

      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c');
      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        image: '',
        image_file: null,
        image_type: null
      });
      expect(parentControls['input-field-name'].clearValidators).toHaveBeenCalled();
    });
  });
});
