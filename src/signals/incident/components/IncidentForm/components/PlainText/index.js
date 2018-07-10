import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const TextInput = ({ meta, parent }) => (
  <div>
    {meta.ifVisible ?
      <div className="row mode_input plain-text">
        <div className={`col-${meta.cols || 12}`}>
          <div className={`${meta.type} plain-text__box`}>
            <div className="label">{meta.label}</div>

            {meta.field && parent.meta.incident && parent.meta.incident[meta.field]}

            {meta.value && typeof meta.value === 'string' ?
              meta.value :
              ''
            }

            {meta.value && typeof meta.value !== 'string' ?
              meta.value.map((paragraph, key) => (
                <div
                  key={`${meta.name}-${key + 1}`}
                  className={`plain-text__box-p plain-text__box-p-${key + 1}`}
                >{paragraph}</div>
              ))
              : ''
            }
          </div>
        </div>
      </div>
       : ''}
  </div>
);

TextInput.propTypes = {
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default TextInput;
