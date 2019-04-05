import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';
import './style.scss';

const FileInput = ({ touched, hasError, getError, parent, meta, validatorsOrOpts }) => {
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length) {
      const maxFileSizeFilter = meta.maxFileSize ? (file) => file.size <= meta.maxFileSize : () => true;
      const allowedFileTypesFilter = meta.allowedFileTypes ? (file) => meta.allowedFileTypes.includes(file.type) : () => true;
      const maxNumberOfFilesFilter = meta.maxNumberOfFiles ? (file, index) => index < meta.maxNumberOfFiles : () => true;
      const existingFiles = (parent && parent.value && parent.value[meta.name]) || [];

      const files = [...existingFiles, ...e.target.files]
        .filter(maxFileSizeFilter)
        .filter(allowedFileTypesFilter)
        .filter(maxNumberOfFilesFilter);
      const previews = files.map(() => `loading-${Math.trunc(Math.random() * 100000)}`);
      parent.meta.updateIncident({
        [meta.name]: files,
        [`${meta.name}_previews`]: previews
      });

      files.forEach((file, uploadBatchIndex) => {
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

  const removeFile = (e, preview, previews, files) => {
    e.preventDefault();

    const key = previews.indexOf(preview);
    if (key !== -1) {
      window.URL.revokeObjectURL(preview);

      files.splice(key, 1);
      previews.splice(key, 1);

      parent.meta.updateIncident({
        [meta.name]: files,
        [`${meta.name}_previews`]: previews
      });
    }

    const control = meta && meta.name && parent.controls[meta.name];
    control.updateValueAndValidity();
  };

  const previews = (parent && parent.value && parent.value[`${meta.name}_previews`]) || [];
  const files = (parent && parent.value && parent.value[meta.name]) || [];
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
                (<div key={preview} className="file-input__preview">
                  {preview.includes('loading') ?
                    <div>Loading...</div>
                  :
                    <div style={{ backgroundImage: `URL(${preview})` }} className="file-input__preview-image">
                      <button title="Verwijder deze foto" className="file-input__preview-button-delete link-functional delete" onClick={(e) => removeFile(e, preview, previews, files)} />
                    </div>
                 }
                </div>)
              ) : '' }

              {previews.length < meta.maxNumberOfFiles ?
              (<div className="file-input__button">
                <input
                  type="file"
                  id="formUpload"
                  onChange={handleChange}
                  multiple
                />
                <label htmlFor="formUpload" className="file-input__button-submit">+</label>
              </div>)
            : ''}

              {empty.map((item) =>
                (<div key={item} className="file-input__empty">&nbsp;</div>)
              )}
            </div>
          </Header>
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
