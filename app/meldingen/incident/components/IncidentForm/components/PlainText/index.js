import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const TextInput = ({ meta, parent }) => (
  <div className="row mode_input plain-text">
    <div className={`col-${meta.cols || 12}`}>
      <div className={meta.type}>
        <div>{meta.label}</div>
        {meta.field && parent.meta.incident && parent.meta.incident[meta.field]}
      </div>
    </div>
  </div>
);

TextInput.propTypes = {
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default TextInput;
