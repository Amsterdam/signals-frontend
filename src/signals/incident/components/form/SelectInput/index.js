import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash.map';
import isObject from 'lodash.isobject';

import Header from '../Header/';

const SelectInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible ?
      <div className={`${meta.className || 'col-12'} mode_input`}>
        <Header
          meta={meta}
          options={validatorsOrOpts}
          touched={touched}
          hasError={hasError}
          getError={getError}
        >
          <div className="invoer">
            <select
              type="select"
              value={handler().value.id}
              onChange={(e) => parent.meta.updateIncident({ [meta.name]: {
                id: e.target.value,
                label: e.target[e.target.selectedIndex].text
              } })}
            >
              {meta.values && isObject(meta.values) ?
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
