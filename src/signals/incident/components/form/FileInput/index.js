import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';
// import { validateFileType, validateMaxFilesize } from '../../../services/custom-validators';
import './style.scss';

const FileInput = ({ /* handler, */touched, hasError, getError, parent, meta, validatorsOrOpts }) => {
  const handleChange = (e) => {
    // console.log('handleChange', e.target.files);
    if (e.target.files && e.target.files.length) {
      const maxFileSizeFilter = meta.maxFileSize ? (file) => file.size <= meta.maxFileSize : () => true;
      const allowedFileTypesFilter = meta.allowedFileTypes ? (file) => meta.allowedFileTypes.includes(file.type) : () => true;
      const maxNumberOfFilesFilter = meta.maxNumberOfFiles ? (file, index) => index < meta.maxNumberOfFiles : () => true;
      const existingFiles = (parent && parent.value && parent.value[meta.name]) || [];

      const files = [...existingFiles, ...e.target.files]
        .filter(maxFileSizeFilter)
        .filter(allowedFileTypesFilter)
        .filter(maxNumberOfFilesFilter);
      const previews = files.map((file) => window.URL.createObjectURL(file));

      parent.meta.updateIncident({
        [meta.name]: files,
        [`${meta.name}_previews`]: previews
      });

      files.forEach((file, i) => {
        console.log('start', i, file);
        const reader = new window.FileReader();

        reader.onprogress = (event) => {
          console.log('progress', i, event);
        };

        reader.addEventListener('load', () => {
          console.log('end', i);
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

  const previews = parent && parent.value && parent.value[`${meta.name}_previews`];
  const files = parent && parent.value && parent.value[meta.name];

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
              {previews && previews.map((preview) =>
                (<div key={preview} className="file-input__preview">
                  <button title="Verwijder deze foto" className="file-input__preview-button-delete link-functional delete" onClick={(e) => removeFile(e, preview, previews, files)} />
                  <img
                    alt="Preview uploaded foto"
                    src={preview}
                    className="file-input__preview-image"
                  />
                </div>)
              )}

              {!previews || (previews && previews.length) < 3 ?
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
