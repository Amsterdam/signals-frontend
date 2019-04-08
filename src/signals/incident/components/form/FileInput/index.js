import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';
import './style.scss';

const FileInput = ({ touched, hasError, getError, parent, meta, validatorsOrOpts }) => {
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length) {
      const maxFileSizeFilter = meta.maxFileSize ? checkFileSize : () => true;
      const allowedFileTypesFilter = meta.allowedFileTypes ? checkFileType : () => true;
      const maxNumberOfFilesFilter = meta.maxNumberOfFiles ? checkNumberOfFiles : () => true;
      const existingFiles = (parent && parent.value && parent.value[meta.name]) || [];
      const existingPreviews = (parent && parent.value && parent.value[`${meta.name}_previews`]) || [];
      const batchFiles = [...e.target.files];

      existingFiles.map((file) => ({ ...file, existing: true }));

      const files = [...existingFiles, ...batchFiles]
        .filter(maxFileSizeFilter)
        .filter(allowedFileTypesFilter)
        .filter(maxNumberOfFilesFilter);

      const previews = [...existingPreviews, ...batchFiles.map(() => `loading-${Math.trunc(Math.random() * 100000)}`)]
        .slice(0, files.length);

      const errors = [];
      const allFiles = [...existingFiles, ...batchFiles];
      if (meta.maxFileSize && !allFiles.every(checkFileSize)) {
        errors.push('Dit bestand is te groot. De maximale bestandgrootte is 8Mb.');
      }
      if (meta.allowedFileTypes && !allFiles.every(checkFileType)) {
        errors.push('Dit bestandstype wordt niet ondersteund. Toegestaan zijn: jpeg, png,gif.');
      }
      if (meta.maxNumberOfFiles && !allFiles.every(checkNumberOfFiles)) {
        errors.push('U kunt maximaal 3 bestanden uploaden.');
      }
      parent.meta.updateIncident({
        [meta.name]: files,
        [`${meta.name}_previews`]: previews,
        [`${meta.name}_errors`]: errors
      });

      files.forEach((file, uploadBatchIndex) => {
        if (files[uploadBatchIndex].existing) {
          return;
        }
        const reader = new window.FileReader();

        reader.addEventListener('load', () => {
          previews[uploadBatchIndex] = window.URL.createObjectURL(files[uploadBatchIndex]);
          parent.meta.updateIncident({
            [`${meta.name}_previews`]: previews
          });

          const control = meta && meta.name && parent.controls[meta.name];
          control.updateValueAndValidity();
        });

        reader.readAsText(file);
      });
    }
  };

  const checkFileSize = (file) => file.size <= meta.maxFileSize;

  const checkFileType = (file) => meta.allowedFileTypes.includes(file.type);

  const checkNumberOfFiles = (file, index) => index < meta.maxNumberOfFiles;

  const removeFile = (e, preview, previews, files) => {
    e.preventDefault();

    const key = previews.indexOf(preview);
    if (key !== -1) {
      window.URL.revokeObjectURL(preview);

      files.splice(key, 1);
      previews.splice(key, 1);

      parent.meta.updateIncident({
        [meta.name]: files,
        [`${meta.name}_previews`]: previews,
        [`${meta.name}_errors`]: null
      });
    }

    const control = meta && meta.name && parent.controls[meta.name];
    control.updateValueAndValidity();
  };

  const previews = (parent && parent.value && parent.value[`${meta.name}_previews`]) || [];
  const files = (parent && parent.value && parent.value[meta.name]) || [];
  const errors = (parent && parent.value && parent.value[`${meta.name}_errors`]) || null;
  const numberOfEmtpy = meta.maxNumberOfFiles - previews.length - 1;
  const empty = numberOfEmtpy < 0 ? [] : Array.from(Array(numberOfEmtpy).keys());

  return (
    <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
      {meta && meta.isVisible ?
        <div className={`${meta.className || 'col-12'} mode_input file`}>
          <Header
            meta={meta}
            options={validatorsOrOpts}
            touched={touched}
            hasError={hasError}
            getError={getError}
          >
            <div className="file-input">
              {previews.length ? previews.map((preview) =>
                (<div key={preview} className={`file-input__preview ${preview.includes('loading') ? 'file-input__preview--loading' : ''}`}>
                  {preview.includes('loading') ?
                    <div className="progress-indicator progress-red"></div>
                  :
                    <div style={{ backgroundImage: `URL(${preview})` }} className="file-input__preview-image">
                      <button title="Verwijder deze foto" className="file-input__preview-button-delete link-functional delete" onClick={(e) => removeFile(e, preview, previews, files)} />
                    </div>
                 }
                </div>)
              ) : '' }

              {previews.length < meta.maxNumberOfFiles ?
              (<div className="file-input__button">
                <label htmlFor="formUpload" className="file-input__button-label">&nbsp;</label>
                <input
                  type="file"
                  id="formUpload"
                  onChange={handleChange}
                  multiple
                />
                <label htmlFor="formUpload" className="file-input__button-icon">&nbsp;</label>
              </div>)
            : ''}

              {empty.map((item) =>
                (<div key={item} className="file-input__empty">&nbsp;</div>)
              )}
            </div>
          </Header>
          {errors && errors.length ?
            errors.map((error) =>
              <div key={error} className="file-input__error">{error}</div>)
            : ''}
        </div>
         : ''}
    </div>
  );
};

FileInput.propTypes = {
  // handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func.isRequired,
  validatorsOrOpts: PropTypes.object
};

export default FileInput;
