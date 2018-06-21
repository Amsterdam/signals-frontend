import React from 'react';
import PropTypes from 'prop-types';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

// import Icon from '../../../../../../shared/images/icon-plus.svg';

import './style.scss';

function handleChange(event, parent) {
  if (event.target.files && event.target.files.length) {
    const file = event.target.files[0];

    // use revokeObjectURL afterward
    const url = URL.createObjectURL(file);
    parent.meta.setIncident({
      image: url
    });

    const reader = new FileReader();
    reader.onload = () => {
      parent.meta.setIncident({
        image_blob: reader.result
      });
    };

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(file);
  }
}

function handleClear(url, parent) {
  URL.revokeObjectURL(url);
  parent.meta.setIncident({
    image: '',
    image_blob: ''
  });
}

const FileInput = ({ handler, touched, hasError, parent, meta }) => (
  <div className="rij mode_upload file">
    <Title meta={meta} />

    {handler().value ?
      <div className="file-input__preview">
        <button
          className="link-functional delete"
          onClick={() => handleClear(handler().value, parent)}
        />

        <img
          alt="Preview uploaded foto"
          src={handler().value}
          className="file-input__preview-image"
        />
      </div>
    :
      <div className="invoer">
        <input
          type="file"
          id="formUpload"
          onChange={(e) => handleChange(e, parent)}
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
);

FileInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default FileInput;
