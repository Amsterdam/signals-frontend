import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor, themeSpacing } from '@datapunt/asc-ui';

import Header from '../Header';
import fileSize from '../../../services/file-size';

import './style.scss';

export const ERROR_TIMEOUT_INTERVAL = 8000;

const FileInputError = styled.div`
    color: ${themeColor('secondary')};
    margin: ${themeSpacing(4, 0, 0)};
  }
`;

const FileInput = ({ handler, touched, hasError, getError, parent, meta, validatorsOrOpts }) => {
  let timeoutInstance = null;
  const maxNumberOfFiles = (meta && meta.maxNumberOfFiles) || 3;
  const handleChange = e => {
    /* istanbul ignore next */
    if (e.target.files && e.target.files.length) {
      const minFileSizeFilter = meta.minFileSize ? checkMinFileSize : () => true;
      const maxFileSizeFilter = meta.maxFileSize ? checkMaxFileSize : () => true;
      const allowedFileTypesFilter = meta.allowedFileTypes ? checkFileType : () => true;
      const maxNumberOfFilesFilter = checkNumberOfFiles;
      const existingFiles = handler().value || [];
      const existingPreviews = (parent && parent.value && parent.value[`${meta.name}_previews`]) || [];
      const batchFiles = [...e.target.files];

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
      const errors = getErrorMessages([...existingFiles, ...batchFiles]);
      parent.meta.updateIncident({
        [meta.name]: files,
        [`${meta.name}_previews`]: previews,
        [`${meta.name}_errors`]: errors,
      });

      if (errors.length) {
        if (timeoutInstance) {
          global.window.clearTimeout(timeoutInstance);
        }

        timeoutInstance = global.window.setTimeout(() => {
          parent.meta.updateIncident({
            [`${meta.name}_errors`]: null,
          });
        }, ERROR_TIMEOUT_INTERVAL);
      }

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
  };

  const checkMinFileSize = file => file.size >= meta.minFileSize;

  const checkMaxFileSize = file => file.size < meta.maxFileSize;

  const checkFileType = file => meta.allowedFileTypes.includes(file.type);

  const checkNumberOfFiles = (file, index) => index < maxNumberOfFiles;

  const getErrorMessages = files => {
    const errors = [];

    if (meta.minFileSize && !files.every(checkMinFileSize)) {
      errors.push(`Dit bestand is te klein. De minimale bestandgrootte is ${fileSize(meta.minFileSize)}.`);
    }

    if (meta.maxFileSize && !files.every(checkMaxFileSize)) {
      errors.push(`Dit bestand is te groot. De maximale bestandgrootte is ${fileSize(meta.maxFileSize)}.`);
    }

    if (meta.allowedFileTypes && !files.every(checkFileType)) {
      errors.push(
        `Dit bestandstype wordt niet ondersteund. Toegestaan zijn: ${meta.allowedFileTypes
          .map(type => type.replace(/.*\//, ''))
          .join(', ')}.`
      );
    }

    if (!files.every(checkNumberOfFiles)) {
      errors.push(`U kunt maximaal ${maxNumberOfFiles} bestanden uploaden.`);
    }

    return errors;
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
        [`${meta.name}_errors`]: null,
      });
    }

    const control = meta && meta.name && parent.controls[meta.name];
    control.updateValueAndValidity();
  };

  const previews = (parent && parent.value && parent.value[`${meta && meta.name}_previews`]) || [];
  const errors = (parent && parent.value && parent.value[`${meta && meta.name}_errors`]) || null;
  const numberOfEmtpy = maxNumberOfFiles - previews.length - 1;
  const empty = numberOfEmtpy < 0 ? [] : [...Array(numberOfEmtpy).keys()];

  if (!meta?.isVisible) return null;

  return (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      <div className="file-input">
        {previews.length > 0 &&
            previews.map(preview => (
              <div
                key={preview}
                className={`file-input__preview ${preview.includes('loading') ? 'file-input__preview--loading' : ''}`}
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
                    />
                  </div>
                )}
              </div>
            ))}

        {previews.length < maxNumberOfFiles && (
          <div className="file-input__button">
            <label htmlFor="formUpload" className="file-input__button-label">
              <div className="file-input__button-label-icon" />
            </label>
            <input type="file" id="formUpload" accept={meta.allowedFileTypes} onChange={handleChange} multiple />
          </div>
        )}

        {empty.map(item => (
          <div key={item} className="file-input__empty">
              &nbsp;
          </div>
        ))}
      </div>
      {errors?.length > 0 && errors.map(error => <FileInputError key={error}>{error}</FileInputError>)}
    </Header>
  );
};

FileInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func.isRequired,
  validatorsOrOpts: PropTypes.object,
};

export default FileInput;
