import React from 'react';
import { shallow } from 'enzyme';

import FileInput from './index';

describe.only('Form component <FileInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    maxNumberOfFiles: 3
  };
  const parentControls = {
    'input-field-name': {
      updateValueAndValidity: jest.fn()
      // setValidators: jest.fn(),
      // clearValidators: jest.fn(),
      // markAsTouched: jest.fn()
    }
  };
  let wrapper;
  let handler;
  let touched;
  let getError;
  let hasError;
  let parent;

  beforeEach(() => {
    // jest.useFakeTimers();

    handler = jest.fn();
    touched = false;
    getError = jest.fn();
    hasError = jest.fn();
    parent = {
      meta: {
        updateIncident: jest.fn()
      },
      value: jest.fn(),
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
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render upload field with selected 2 files correctly', () => {
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
              'input-field-name_previews': ['blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c', 'blob:http://host/unique-id'],
              'input-field-name_errors': null
            }
          }
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no upload field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false
        }
      });

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
      expect(parentControls['input-field-name'].updateValueAndValidity).not.toHaveBeenCalled();

      wrapper.find('input').simulate('change', { target: { files: [file, file] } });
      expect(FileReader).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
      expect(readAsText).toHaveBeenCalledWith(file);
      expect(parentControls['input-field-name'].updateValueAndValidity).toHaveBeenCalled();
    });

//     it('resets upload when clear button was clicked', () => {
//       handler.mockImplementation(() => ({ value: 'blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c' }));
// //
//       wrapper.setProps({
//         meta: {
//           ...metaFields,
//           isVisible: true
//         }
//       });
// //
//       wrapper.find('button').simulate('click', { preventDefault: jest.fn() });
// //
//       expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c');
//       expect(parent.meta.updateIncident).toHaveBeenCalledWith({
//         image: '',
//         image_file: null,
//         image_type: null
//       });
//       expect(parentControls['input-field-name'].clearValidators).toHaveBeenCalled();
//     });
  });
});
