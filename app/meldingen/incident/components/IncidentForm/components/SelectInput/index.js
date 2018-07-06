/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

const SelectInput = ({ handler, touched, hasError, meta, parent }) => (
  <div>
    {meta.ifVisible
      ? <div className="row mode_input">
        <Title meta={meta} />

        <div className={`col-${meta.cols || 12} invoer`}>
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

        <ErrorMessage
          touched={touched}
          hasError={hasError}
        />
      </div>
      : ''
  }
  </div>
);

SelectInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default SelectInput;
