import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import Header from '../Header/';

const SelectInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible ?
      <div className={`${meta.className || 'col-12'}  mode_input`}>
        <Header
          meta={meta}
          options={validatorsOrOpts}
          touched={touched}
          hasError={hasError}
          getError={getError}
        >
          <div className={`${meta.className || 'col-12'} invoer`}>
            <select
              value={handler().value}
              onChange={(e) => meta.updateIncident && parent.meta.setIncident({ [meta.name]: e.target.value })}
            >
              {meta.values ?
                  map(meta.values, (value, key) => (
                    <option
                      value={key}
                      key={`${meta.name}-${key}`}
                    >{value}</option>
                  ))
                  : ''
              }
            </select>
          </div>
        </Header>
      </div>
      : ''
  }
  </div>
);

SelectInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object
};

export default SelectInput;
