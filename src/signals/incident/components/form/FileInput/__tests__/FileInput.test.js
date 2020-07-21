import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import FileInput from '..';

describe('Form component <FileInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    isVisible: true,
  };

  const props = {
    handler: jest.fn(),
    parent: {
      meta: {
        updateIncident: jest.fn(),
      },
      value: jest.fn(),
      controls: {
        'input-field-name': {
          updateValueAndValidity: jest.fn(),
        },
      },
    },
  };

  describe('rendering', () => {
    it('should render upload field correctly', () => {
      const { getByTestId, getAllByTestId } = render(
        withAppContext(
          <FileInput
            {...props}
            meta={{
              ...metaFields,
              maxNumberOfFiles: 3,
            }}
          />
        )
      );

      expect(getByTestId('fileInput')).toBeInTheDocument();
      expect(getByTestId('fileInputUploadButton')).toBeInTheDocument();
      expect(getAllByTestId('fileInputEmptyBox').length).toBe(2);
    });

    it('should render upload field with one uploaded file and one loading correctly', () => {
      const parentValue = {
        'input-field-name_previews': ['blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c', 'loading-42'],
      };

      const { queryByTestId, getAllByTestId } = render(
        withAppContext(
          <FileInput
            {...props}
            parent={{
              ...props.parent,
              value: parentValue,
            }}
            meta={{
              ...metaFields,
              maxNumberOfFiles: 2,
            }}
          />
        )
      );

      expect(getAllByTestId('fileInputPreviewBox').length).toBe(2);
      expect(queryByTestId('fileInputUploadButton')).not.toBeInTheDocument();
      expect(queryByTestId('fileInputEmptyBox')).not.toBeInTheDocument();
    });

    describe('events', () => {
      const parentControls = {
        'input-field-name': {
          updateValueAndValidity: jest.fn(),
        },
      };

      const minFileSize = 30 * 2 ** 10;
      const maxFileSize = 8 * 2 ** 20;
      let handler;
      let parent;

      const file1 = {
        name: 'bloem.jpeg',
        size: 89691,
        type: 'image/jpeg',
      };
      const file2 = {
        name: 'already uploaded.gif',
        size: 34567,
        type: 'image/gif',
        existing: true,
      };
      const file3 = {
        name: 'way too large file.jpeg',
        size: maxFileSize,
        type: 'image/jpeg',
      };
      const file4 = {
        name: 'poeeee.jpeg',
        size: 34567,
        type: 'image/jpeg',
      };
      const file5 = {
        name: 'way too small file.jpeg',
        size: minFileSize - 1,
        type: 'image/jpeg',
      };

      let readAsText;
      let addEventListener;

      beforeEach(() => {
        handler = jest.fn();
        parent = {
          meta: {
            updateIncident: jest.fn(),
          },
          value: jest.fn(),
          controls: parentControls,
        };

        readAsText = jest.fn();
        addEventListener = jest.fn((_, evtHandler) => {
          evtHandler();
        });
        window.FileReader = jest.fn(() => ({
          addEventListener,
          readAsText,
        }));

        window.URL = {
          createObjectURL: jest.fn(),
          revokeObjectURL: jest.fn(),
        };
      });

      afterEach(() => {
        delete window.URL;
        jest.resetAllMocks();
      });

      it('should do nothing when no files are provided', async () => {
        handler.mockImplementation(() => ({ value: [] }));
        const { findByTestId } = render(
          withAppContext(
            <FileInput
              parent={parent}
              handler={handler}
              meta={{
                ...metaFields,
                maxNumberOfFiles: 3,
              }}
            />
          )
        );

        const fileInputElement = await findByTestId('fileInputUpload');
        expect(FileReader).not.toHaveBeenCalled();
        act(() => {
          fireEvent.change(fileInputElement, { target: { files: [] } });
        });

        await findByTestId('fileInputUpload');

        expect(FileReader).not.toHaveBeenCalled();
        expect(parent.meta.updateIncident).not.toHaveBeenCalled();
      });

      it('uploads a file and updates incident when file changes', async () => {
        handler.mockImplementation(() => ({ value: [] }));
        const { queryByTestId, findByTestId } = render(
          withAppContext(
            <FileInput
              parent={parent}
              handler={handler}
              meta={{
                ...metaFields,
                maxNumberOfFiles: 3,
              }}
            />
          )
        );

        const fileInputElement = queryByTestId('fileInputUpload');
        act(() => {
          fireEvent.change(fileInputElement, { target: { files: [file1] } });
        });

        await findByTestId('fileInputUpload');

        expect(FileReader).toHaveBeenCalled();
        expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
        expect(readAsText).toHaveBeenCalled();
        expect(parentControls['input-field-name'].updateValueAndValidity).toHaveBeenCalledTimes(1);
        expect(parent.meta.updateIncident).toHaveBeenCalled();
      });

      it('uploads already uploaded file and triggers multiple errors', async () => {
        handler.mockImplementation(() => ({ value: [file2, file3, file4] }));
        const { queryByTestId, findByTestId } = render(
          withAppContext(
            <FileInput
              parent={parent}
              handler={handler}
              meta={{
                ...metaFields,
                maxNumberOfFiles: 3,
                maxFileSize,
                allowedFileTypes: ['image/jpeg'],
              }}
            />
          )
        );

        const fileInputElement = queryByTestId('fileInputUpload');
        act(() => {
          fireEvent.change(fileInputElement, { target: { files: [file1] } });
        });

        await findByTestId('fileInputUpload');

        expect(FileReader).toHaveBeenCalled();
        expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
        expect(readAsText).toHaveBeenCalled();
        expect(parentControls['input-field-name'].updateValueAndValidity).toHaveBeenCalledTimes(2);
        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name_previews': expect.any(Array),
          'input-field-name': [file4, file1],
        });
      });

      it('uploads a file with no extra validations', async () => {
        handler.mockImplementation(() => ({ value: undefined }));

        const { queryByTestId, findByTestId } = render(
          withAppContext(
            <FileInput
              parent={parent}
              handler={handler}
              meta={{
                ...metaFields,
                maxNumberOfFiles: 3,
                maxFileSize,
                allowedFileTypes: ['image/jpeg'],
              }}
            />
          )
        );

        const fileInputElement = queryByTestId('fileInputUpload');
        act(() => {
          fireEvent.change(fileInputElement, { target: { files: [file1] } });
        });

        await findByTestId('fileInputUpload');

        expect(FileReader).toHaveBeenCalled();
        expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
        expect(readAsText).toHaveBeenCalled();
        expect(parentControls['input-field-name'].updateValueAndValidity).toHaveBeenCalledTimes(1);
        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name_previews': expect.any(Array),
          'input-field-name': [file1],
        });
      });

      it('it removes 1 file when remove button was clicked', async () => {
        handler.mockImplementation(() => ({ value: [file1, file2] }));

        const { queryAllByTestId, findByTestId } = render(
          withAppContext(
            <FileInput
              parent={{
                ...parent,
                value: {
                  'input-field-name_previews': ['blob:http://host/1', 'blob:http://host/2'],
                },
              }}
              handler={handler}
              meta={{
                ...metaFields,
              }}
            />
          )
        );

        const deleteFotoButtonList = queryAllByTestId('deleteFotoButton');
        expect(deleteFotoButtonList.length).toBe(2);
        act(() => {
          fireEvent.click(deleteFotoButtonList[0], { preventDefault: jest.fn(), foo: 'booo' });
        });

        await findByTestId('fileInputUpload');

        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name': [file2],
          'input-field-name_previews': ['blob:http://host/2'],
        });
      });

      it('returns error when trying to upload file that is too small', async () => {
        handler.mockImplementation(() => ({ value: null }));
        const { queryByTestId, findByTestId } = render(
          withAppContext(
            <FileInput
              parent={parent}
              handler={handler}
              meta={{
                ...metaFields,
                minFileSize,
                maxNumberOfFiles: 2,
              }}
            />
          )
        );

        expect(queryByTestId('fileInputUpload')).toBeInTheDocument();
        expect(queryByTestId('fileInputError')).not.toBeInTheDocument();

        const fileInputElement = queryByTestId('fileInputUpload');
        act(() => {
          fireEvent.change(fileInputElement, { target: { files: [file5] } });
        });

        await findByTestId('fileInputUpload');

        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name_previews': [],
          'input-field-name': [],
        });
        expect(queryByTestId('fileInputError')).toBeInTheDocument();
      });
    });
  });
});
