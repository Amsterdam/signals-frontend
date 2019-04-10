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

    it('should render upload field with one uploaded file and one loading correctly', () => {
      parent.value = {
        'input-field-name_previews': ['blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c', 'loading-42']
      };
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      wrapper.setProps({
        parent: {
          controls: parentControls
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
    // const fileContents = 'file contents';
    // const file = new Blob([fileContents], { type: 'image/jpeg' });
    const file1 = {
      name: 'bloem.jpeg',
      size: 89691,
      type: 'image/jpeg'
    };
    const file2 = {
      name: 'already uploaded.gif',
      size: 24567,
      type: 'image/gif'
    };
    const file3 = {
      name: 'way too large file.jpeg',
      size: 10000000000000,
      type: 'image/jpeg'
    };
    const file4 = {
      name: 'poeeee.jpeg',
      size: 24567,
      type: 'image/jpeg'
    };

    let readAsText;
    let addEventListener;

    beforeEach(() => {
      readAsText = jest.fn();
      addEventListener = jest.fn((_, evtHandler) => { evtHandler(); });
      window.FileReader = jest.fn(() => ({
        addEventListener,
        readAsText
        // result: {
          // incomming: true
        // }
      }));

      window.URL = {
        createObjectURL: jest.fn(),
        revokeObjectURL: jest.fn()
      };
    });

    afterEach(() => {
      delete window.URL;
      jest.resetAllMocks();
    });

    it('uploads a file when and updates incident when file changes', () => {
      handler.mockImplementation(() => ({ value: [] }));

      wrapper.setProps({
        meta: {
          ...metaFields,
          maxFileSize: 1000000,
          allowedFileTypes: ['image/jpeg'],
          isVisible: true
        }
      });

      wrapper.find('input').simulate('change', { target: { files: [file1] } });
      expect(FileReader).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
      expect(readAsText).toHaveBeenCalled();
      expect(parentControls['input-field-name'].updateValueAndValidity).toHaveBeenCalledTimes(1);
      expect(parent.meta.updateIncident).toHaveBeenCalled();
    });

    it('uploads a file and with already uploaded file and triggers multiple errors', () => {
      handler.mockImplementation(() => ({ value: [file2, file3, file4] }));

      wrapper.setProps({
        meta: {
          ...metaFields,
          maxFileSize: 1000000,
          allowedFileTypes: ['image/jpeg'],
          isVisible: true
        }
      });

      wrapper.find('input').simulate('change', { target: { files: [file1] } });
      expect(FileReader).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
      expect(readAsText).toHaveBeenCalled();
      expect(parentControls['input-field-name'].updateValueAndValidity).toHaveBeenCalledTimes(1);
      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name_previews': expect.any(Array),
        'input-field-name': [file4, file1],
        'input-field-name_errors': [
          'Dit bestand is te groot. De maximale bestandgrootte is 976,6 kB.',
          'Dit bestandstype wordt niet ondersteund. Toegestaan zijn: jpeg.',
          'U kunt maximaal 3 bestanden uploaden.',
        ],
      });
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
