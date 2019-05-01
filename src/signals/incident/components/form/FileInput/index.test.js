import React from 'react';
import { shallow } from 'enzyme';

import FileInput, { ERROR_TIMEOUT_INTERVAL } from './index';

describe('Form component <FileInput />', () => {
  const metaFields = {
    name: 'input-field-name'
  };
  const parentControls = {
    'input-field-name': {
      updateValueAndValidity: jest.fn()
    }
  };
  const maxFileSize = 1024 * 1024;
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
          maxNumberOfFiles: 3,
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
          maxNumberOfFiles: 2,
          isVisible: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render upload field with multiple errors correctly', () => {
      parent.value = {
        'input-field-name_errors': [
          'Dit bestand is te groot. De maximale bestandgrootte is 976,6 kB.',
          'Dit bestandstype wordt niet ondersteund. Toegestaan zijn: jpeg.',
          'U kunt maximaal 3 bestanden uploaden.',
        ]
      };
      wrapper.setProps({
        meta: {
          ...metaFields,
          maxNumberOfFiles: 3,
          isVisible: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no upload field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          maxNumberOfFiles: 3,
          isVisible: false
        }
      });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
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
          maxNumberOfFiles: 3,
          maxFileSize,
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

      jest.useFakeTimers();

      wrapper.setProps({
        meta: {
          ...metaFields,
          maxNumberOfFiles: 3,
          maxFileSize,
          allowedFileTypes: ['image/jpeg'],
          isVisible: true
        }
      });

      wrapper.find('input').simulate('change', { target: { files: [file1] } });

      jest.runTimersToTime(ERROR_TIMEOUT_INTERVAL - 1);

      expect(FileReader).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
      expect(readAsText).toHaveBeenCalled();
      expect(parentControls['input-field-name'].updateValueAndValidity).toHaveBeenCalledTimes(2);
      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name_previews': expect.any(Array),
        'input-field-name': [file4, file1],
        'input-field-name_errors': [
          'Dit bestand is te groot. De maximale bestandgrootte is 1 MB.',
          'Dit bestandstype wordt niet ondersteund. Toegestaan zijn: jpeg.',
          'U kunt maximaal 3 bestanden uploaden.',
        ]
      });

      jest.runTimersToTime(1);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name_errors': null
      });

      jest.runAllTimers();
    });

    it('uploads a file with no extra validations', () => {
      handler.mockImplementation(() => ({ value: undefined }));

      wrapper.setProps({
        meta: {
          ...metaFields,
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
        'input-field-name': [file1],
        'input-field-name_errors': [],
      });
    });

    it('it removes 1 file when remove button was clicked', () => {
      parent.value = {
        'input-field-name_previews': ['blob:http://host/1', 'blob:http://host/2']
      };

      handler.mockImplementation(() => ({ value: [file1, file2] }));

      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      wrapper.find('button').first().simulate('click', { preventDefault: jest.fn(), foo: 'booo' });

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': [file2],
        'input-field-name_previews': ['blob:http://host/2'],
        'input-field-name_errors': null
      });
    });
  });
});
