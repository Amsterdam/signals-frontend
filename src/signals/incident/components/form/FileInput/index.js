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

      const files = [...e.target.files]
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

  const handleClear = (e, previews) => {
    e.preventDefault();
    previews.map((url) => window.URL.revokeObjectURL(url));
    parent.meta.updateIncident({
      [meta.name]: null,
      [`${meta.name}_previews`]: null
    });

    const control = meta && meta.name && parent.controls[meta.name];
    control.updateValueAndValidity();
  };

  const previews = parent && parent.value && parent.value[`${meta.name}_previews`];

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
            <div className="file-input__preview">
              {previews && previews.map((preview) =>
                (<img
                  key={preview}
                  alt="Preview uploaded foto"
                  src={preview}
                  className="file-input__preview-image"
                />)
              )}
              {previews && previews.length ?
                <button title="Verwijder alle uploaded foto's" className="file-input__button-delete link-functional delete" onClick={(e) => handleClear(e, previews)} />
            :
                <div className="invoer">
                  <input
                    type="file"
                    id="formUpload"
                    onChange={handleChange}
                    multiple
                  />
                  <label htmlFor="formUpload" className="secundary-blue">{meta.submitLabel}</label>
                </div>
            }

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
