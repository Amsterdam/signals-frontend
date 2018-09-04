import React from 'react';
import PropTypes from 'prop-types';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

import './style.scss';

const FileInput = ({ handler, touched, hasError, getError, parent, meta }) => {
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];

      // use revokeObjectURL afterward
      const url = window.URL.createObjectURL(file);
      parent.meta.setIncident({
        image: url
      });

      const reader = new window.FileReader();
      reader.addEventListener('load', () => {
        parent.meta.setIncident({
          image_file: file
        });
      });

      reader.readAsText(file);
    }
  };

  const handleClear = (url) => {
    window.URL.revokeObjectURL(url);
    parent.meta.setIncident({
      image: '',
      image_file: {}
    });
  };

  return (
    <div>
      {meta && meta.isVisible ?
        <div className="row mode_upload file">
          <Title meta={meta} />

          {handler().value ?
            <div className={`col-${meta.cols || 12} file-input__preview`}>
              <button
                className="file-input__clear-button"
                onClick={() => handleClear(handler().value)}
              />

              <img
                alt="Preview uploaded foto"
                src={handler().value}
                className="file-input__preview-image"
              />
            </div>
          :
            <div className={`col-${meta.cols || 12} invoer`}>
              <input
                type="file"
                id="formUpload"
                onChange={handleChange}
              />
              <label htmlFor="formUpload" className="secundary-blue">{meta.submitLabel}</label>
            </div>
          }

          <ErrorMessage
            touched={touched}
            hasError={hasError}
            getError={getError}
          />
        </div>
         : ''}
    </div>
  );
};

FileInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func.isRequired
};

export default FileInput;
