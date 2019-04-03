import React from 'react';
import PropTypes from 'prop-types';
import { map, forEach } from 'lodash';

import Header from '../Header/';
// import { validateFileType, validateMaxFilesize } from '../../../services/custom-validators';
import './style.scss';

const FileInput = ({ handler, touched, hasError, getError, parent, meta, validatorsOrOpts }) => {
  const handleChange = (e) => {
    console.log('handleChange', e.target.files);
    if (e.target.files && e.target.files.length) {
      const preview = map(e.target.files, (file) => window.URL.createObjectURL(file));
      parent.meta.updateIncident({
        [meta.name]: e.target.files,
        [`${meta.name}_preview`]: preview
      });
      forEach(e.target.files, (file, i) => {
        // const file = e.target.files[i];
        console.log('start', i, file);
        // use revokeObjectURL afterward
        // const url = window.URL.createObjectURL(file);
        // parent.meta.updateIncident({
          // [meta.name]: url
        // });

        const reader = new window.FileReader();
        // reader.yo = i;

        // reader.onprogress = (event) => {
          // console.log('progress', i, event);
        // };
        reader.addEventListener('load', () => {
          console.log('end', i, file);
          const control = meta && meta.name && parent.controls[meta.name];
          control.updateValueAndValidity();
          // console.log('end files', files);
          // parent.meta.updateIncident({
            // [`${meta.name}_type`]: file.type
          // });

          // control.markAsTouched();
          /* istanbul ignore next */
          // control.setValidators([
            // () => validateFileType(file, meta),
            // () => validateMaxFilesize(file, meta)
          // ]);
        });
        reader.readAsText(file);
      });
    }
  };

  const handleClear = (e, url) => {
    e.preventDefault();

    window.URL.revokeObjectURL(url);
    parent.meta.updateIncident({
      [meta.name]: null,
      // [`${meta.name}_type`]: null,
      [`${meta.name}_preview`]: null
    });

    const control = meta && meta.name && parent.controls[meta.name];
    control.updateValueAndValidity();
    // control.clearValidators();
  };

  const previews = parent && parent.value && parent.value[`${meta.name}_preview`];

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
            <div>
              {previews && map(previews, (preview) =>
                (<img
                  key={preview}
                  alt="Preview uploaded foto"
                  src={preview}
                  className="file-input__preview-image"
                />)
              )}
              {handler().value ?
                <button title="Verwijder upload foto" className="file-input__button-delete link-functional delete" onClick={(e) => handleClear(e, handler().value)} />
            :
                <div className=" ">
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
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func.isRequired,
  validatorsOrOpts: PropTypes.object
};

export default FileInput;
