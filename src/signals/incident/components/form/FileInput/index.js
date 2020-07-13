import React, { Fragment, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor, themeSpacing } from '@datapunt/asc-ui';

import fileSize from '../../../services/file-size';

import './style.scss';

const BOX_SIZE = '102px';

const FileInputStyle = styled.div`
  display: flex;
  height: ${BOX_SIZE};
`;

const FileInputPreviewBox = styled.div`
  width: ${BOX_SIZE};
  margin-right: ${themeSpacing(3)};
`;

const FileInputEmptyBox = styled.div`
  width: ${BOX_SIZE};
  border: 1px dashed ${themeColor('tint', 'level4')};
  margin-right: ${themeSpacing(3)};
`;

const FileInputError = styled.div`
  color: ${themeColor('secondary')};
  margin: ${themeSpacing(4, 0, 0)};
`;

const FileInputUploadButton = styled.div`
  width: ${BOX_SIZE};
  border: 1px dashed ${themeColor('tint', 'level4')};
  margin-right: ${themeSpacing(3)};

  input[type='file'] {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const FileInput = ({ handler, parent, meta }) => {
  const [errors, setErrors] = useState();
  const maxNumberOfFiles = (meta && meta.maxNumberOfFiles) || 3;

  const handleChange = useCallback(event => {
    /* istanbul ignore next */
    if (event.target.files && event.target.files.length) {
      const minFileSizeFilter = meta.minFileSize ? checkMinFileSize : () => true;
      const maxFileSizeFilter = meta.maxFileSize ? checkMaxFileSize : () => true;
      const allowedFileTypesFilter = meta.allowedFileTypes ? checkFileType : () => true;
      const maxNumberOfFilesFilter = checkNumberOfFiles;
      const existingFiles = handler().value || [];
      const existingPreviews = (parent && parent.value && parent.value[`${meta.name}_previews`]) || [];
      const batchFiles = [...event.target.files];

      existingFiles.map(file => ({ ...file, existing: true }));
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
        if (files[uploadBatchIndex].existing) {
          return;
        }

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
    }
  }, []);

  const checkMinFileSize = file => file.size >= meta.minFileSize;

  const checkMaxFileSize = file => file.size < meta.maxFileSize;

  const checkFileType = file => meta.allowedFileTypes.includes(file.type);

  const checkNumberOfFiles = (file, index) => index < maxNumberOfFiles;

  const getErrorMessages = files => {
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
  };

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
            <FileInputPreviewBox
              key={preview}
              className={`file-input__preview ${preview.includes('loading') ? 'file-input__preview--loading' : ''}`}
              data-testid="fileInputPreviewBox"
            >
              {preview.includes('loading') ? (
                <div className="progress-indicator progress-red"></div>
              ) : (
                <div style={{ backgroundImage: `URL(${preview})` }} className="file-input__preview-image">
                  <button
                    aria-label="Verwijder deze foto"
                    type="button"
                    className="file-input__preview-button-delete"
                    onClick={e => removeFile(e, preview, previews, handler().value)}
                    data-testid="deleteFotoButton"
                  />
                </div>
              )}
            </FileInputPreviewBox>
          ))}

        {previews.length < maxNumberOfFiles && (
          <FileInputUploadButton className="file-input__button" data-testid="fileInputUploadButton">
            <label htmlFor="formUpload" className="file-input__button-label">
              <div className="file-input__button-label-icon" />
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
