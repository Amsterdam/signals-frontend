import React, { Fragment, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TrashBin, Enlarge } from '@datapunt/asc-assets';
import fileSize from '../../../services/file-size';
import FileInputStyle, {
  FileInputPreviewBox,
  FileInputEmptyBox,
  FileInputUploadButton,
  FileInputError,
  DeleteButton,
  AddButton,
  AddIcon,
  FilePreview,
  FileLoading,
} from './styles';

const FileInput = ({ handler, parent, meta }) => {
  const [errors, setErrors] = useState();
  const maxNumberOfFiles = (meta && meta.maxNumberOfFiles) || 3;
  const checkMinFileSize = useCallback(file => file.size >= meta.minFileSize, [meta]);

  const checkMaxFileSize = useCallback(file => file.size < meta.maxFileSize, [meta]);

  const checkFileType = useCallback(file => meta.allowedFileTypes.includes(file.type), [meta]);

  const checkNumberOfFiles = useCallback((file, index) => index < maxNumberOfFiles, [maxNumberOfFiles]);

  const getErrorMessages = useCallback(
    files => {
      const errorMessages = [];

      if (meta.minFileSize && !files.every(checkMinFileSize)) {
        errorMessages.push(`Dit bestand is te klein. De minimale bestandgrootte is ${fileSize(meta.minFileSize)}.`);
      }

      if (meta.maxFileSize && !files.every(checkMaxFileSize)) {
        errorMessages.push(`Dit bestand is te groot. De maximale bestandgrootte is ${fileSize(meta.maxFileSize)}.`);
      }

      if (meta.allowedFileTypes && !files.every(checkFileType)) {
        errorMessages.push(
          `Dit bestandstype wordt niet ondersteund. Toegestaan zijn: ${meta.allowedFileTypes
            .map(type => type.replace(/.*\//, ''))
            .join(', ')}.`
        );
      }

      if (!files.every(checkNumberOfFiles)) {
        errorMessages.push(`U kunt maximaal ${maxNumberOfFiles} bestanden uploaden.`);
      }

      return errorMessages;
    },
    [meta, checkMinFileSize, checkMaxFileSize, checkFileType, checkNumberOfFiles, maxNumberOfFiles]
  );

  const handleChange = useCallback(
    event => {
      if (!event?.target?.files?.length) return;

      const minFileSizeFilter = meta.minFileSize ? checkMinFileSize : () => true;
      const maxFileSizeFilter = meta.maxFileSize ? checkMaxFileSize : () => true;
      const allowedFileTypesFilter = meta.allowedFileTypes ? checkFileType : () => true;
      const maxNumberOfFilesFilter = checkNumberOfFiles;
      const existingFiles = handler().value || [];
      const existingPreviews = (parent && parent.value && parent.value[`${meta.name}_previews`]) || [];
      const batchFiles = [...event.target.files];

      const files = [...existingFiles, ...batchFiles]
        .filter(minFileSizeFilter)
        .filter(maxFileSizeFilter)
        .filter(allowedFileTypesFilter)
        .filter(maxNumberOfFilesFilter);

      const previews = [
        ...existingPreviews,
        ...batchFiles.map(() => `loading-${Math.trunc(Math.random() * 100000)}`),
      ].slice(0, files.length);
      setErrors(getErrorMessages([...existingFiles, ...batchFiles]));
      parent.meta.updateIncident({
        [meta.name]: files,
        [`${meta.name}_previews`]: previews,
      });

      files.forEach((file, uploadBatchIndex) => {
        const reader = new window.FileReader();
        reader.addEventListener('load', () => {
          previews[uploadBatchIndex] = window.URL.createObjectURL(files[uploadBatchIndex]);
          parent.meta.updateIncident({
            [`${meta.name}_previews`]: previews,
          });

          const control = meta && meta.name && parent.controls[meta.name];
          control.updateValueAndValidity();
        });

        reader.readAsText(file);
      });
    },
    [checkMinFileSize, checkMaxFileSize, checkFileType, checkNumberOfFiles, getErrorMessages, handler, meta, parent]
  );

  const removeFile = (e, preview, previews, files) => {
    e.preventDefault();

    const key = previews.indexOf(preview);
    /* istanbul ignore next */
    if (key !== -1) {
      window.URL.revokeObjectURL(preview);

      files.splice(key, 1);
      previews.splice(key, 1);

      parent.meta.updateIncident({
        [meta.name]: files,
        [`${meta.name}_previews`]: previews,
      });
    }

    const control = meta && meta.name && parent.controls[meta.name];
    control.updateValueAndValidity();
  };

  const previews = (parent && parent.value && parent.value[`${meta && meta.name}_previews`]) || [];
  const numberOfEmtpy = maxNumberOfFiles - previews.length - 1;
  const empty = numberOfEmtpy < 0 ? [] : [...Array(numberOfEmtpy).keys()];

  return (
    <Fragment>
      <FileInputStyle className="file-input" data-testid="fileInput">
        {previews.length > 0 &&
          previews.map(preview => (
            <FileInputPreviewBox key={preview} data-testid="fileInputPreviewBox">
              {preview.includes('loading') ? (
                <FileLoading>Laden...</FileLoading>
              ) : (
                <FilePreview preview={preview}>
                  <DeleteButton
                    size={40}
                    variant="blank"
                    iconSize={22}
                    icon={<TrashBin />}
                    aria-label="Verwijder deze foto"
                    onClick={e => removeFile(e, preview, previews, handler().value)}
                    data-testid="deleteFotoButton"
                  />
                </FilePreview>
              )}
            </FileInputPreviewBox>
          ))}

        {previews.length < maxNumberOfFiles && (
          <FileInputUploadButton data-testid="fileInputUploadButton">
            <label htmlFor="formUpload">
              <AddButton aria-label="Toevoegen foto">
                <AddIcon size={22}>
                  <Enlarge />
                </AddIcon>
              </AddButton>
            </label>
            <input
              type="file"
              id="formUpload"
              data-testid="fileInputUpload"
              accept={meta.allowedFileTypes}
              onChange={handleChange}
              multiple
            />
          </FileInputUploadButton>
        )}

        {empty.map(item => (
          <FileInputEmptyBox key={item} data-testid="fileInputEmptyBox" />
        ))}
      </FileInputStyle>

      {errors?.length > 0 &&
        errors.map(error => (
          <FileInputError key={error} data-testid="fileInputError">
            {error}
          </FileInputError>
        ))}
    </Fragment>
  );
};

FileInput.propTypes = {
  handler: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default FileInput;
