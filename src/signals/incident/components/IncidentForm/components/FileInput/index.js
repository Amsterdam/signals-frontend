import React from 'react';
import PropTypes from 'prop-types';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

import './style.scss';

const FileInput = ({ handler, touched, hasError, parent, meta }) => {
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];

      // use revokeObjectURL afterward
      const url = URL.createObjectURL(file);
      parent.meta.setIncident({
        image: url
      });

      const reader = new FileReader();
      reader.onload = () => {
        parent.meta.setIncident({
          image_file: file
        });
      };

      reader.onabort = () => console.log('file reading was aborted'); // eslint-disable-line no-console
      reader.onerror = () => console.log('file reading has failed');  // eslint-disable-line no-console

      reader.readAsBinaryString(file);
    }
  };

  const handleClear = (url) => {
    URL.revokeObjectURL(url);
    parent.meta.setIncident({
      image: '',
      image_file: {}
    });
  };

  return (
    <div>
      {meta.ifVisible ?
        <div className="row mode_upload file">
          <Title meta={meta} />

          {handler().value ?
            <div className={`col-${meta.cols || 12} file-input__preview`}>
              <button
                className="link-functional delete"
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
                readOnly={meta.readOnly}
              />
              <label htmlFor="formUpload" className="secundary-blue">{meta.submitLabel}</label>
            </div>
          }

          <ErrorMessage
            touched={touched}
            hasError={hasError}
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
  parent: PropTypes.object
};

export default FileInput;
