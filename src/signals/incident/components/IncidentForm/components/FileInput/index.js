import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';
import { validateFileType, validateMaxFilesize } from '../../services/custom-validators';
import './style.scss';

const FileInput = ({ handler, touched, hasError, getError, parent, meta, validatorsOrOpts }) => {
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];

      // use revokeObjectURL afterward
      const url = window.URL.createObjectURL(file);
      parent.meta.updateIncident({
        [meta.name]: url
      });

      const reader = new window.FileReader();
      reader.addEventListener('load', () => {
        const control = meta && meta.name && parent.controls[meta.name];

        parent.meta.updateIncident({
          [`${meta.name}_file`]: file,
          [`${meta.name}_type`]: file.type
        });

        control.markAsTouched();
        /* istanbul ignore next */
        control.setValidators([
          () => validateFileType(file, meta),
          () => validateMaxFilesize(file, meta)
        ]);
      });

      reader.readAsText(file);
    }
  };

  const handleClear = (e, url) => {
    e.preventDefault();

    const control = meta && meta.name && parent.controls[meta.name];
    control.clearValidators();

    window.URL.revokeObjectURL(url);
    parent.meta.updateIncident({
      [meta.name]: '',
      [`${meta.name}_file`]: null,
      [`${meta.name}_type`]: null
    });
  };

  const fileType = parent && parent.value && parent.value[`${meta.name}_type`];

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
            {handler().value ?
              <div className="file-input__preview">
                <button
                  title="Verwijder upload foto"
                  className="file-input__button-delete link-functional delete"
                  onClick={(e) => handleClear(e, handler().value)}
                />
                {fileType && fileType.split('/')[0] === 'image' ?
                  <img
                    alt="Preview uploaded foto"
                    src={handler().value}
                    className="file-input__preview-image"
                  />
                : ''}
              </div>
            :
              <div className="invoer">
                <input
                  type="file"
                  id="formUpload"
                  onChange={handleChange}
                />
                <label htmlFor="formUpload" className="secundary-blue">{meta.submitLabel}</label>
              </div>
            }
          </Header>
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
  getError: PropTypes.func.isRequired,
  validatorsOrOpts: PropTypes.object
};

export default FileInput;
