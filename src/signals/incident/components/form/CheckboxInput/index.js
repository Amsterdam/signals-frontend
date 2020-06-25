import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash.map';
import isObject from 'lodash.isobject';
import { Label } from '@datapunt/asc-ui';

import Checkbox from 'components/Checkbox';

import Header from '../Header';

function updateIncidentCheckboxMulti(checked, value, key, oldValue, meta, parent) {
  let output = [...oldValue];
  if (checked) {
    output.push({
      id: key,
      label: value,
    });
  } else {
    output = output.filter(item => item.id !== key);
  }

  parent.meta.updateIncident({ [meta.name]: output });
}

const CheckboxInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) =>
  meta?.isVisible && (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      {isObject(meta.values) ? (
        <Fragment>
          <input type="hidden" {...handler()} />

          {map(meta.values, (value, key) => (
            <div key={key}>
              <Checkbox
                id={`${meta.name}-${key + 1}`}
                name={`${meta.name}-${key + 1}`}
                value={key}
                checked={(handler().value || []).find(item => item.id === key)}
                onClick={e => updateIncidentCheckboxMulti(e.target.checked, value, key, handler().value, meta, parent)}
              />
              <label htmlFor={`${meta.name}-${key + 1}`}>{value}</label>
            </div>
          ))}
        </Fragment>
      ) : (
        <div className="checkboxWrapper">
          <Checkbox
            id={meta.name}
            name={meta.name}
            checked={handler().value.value}
            onClick={e => {
              parent.meta.updateIncident({
                [meta.name]: {
                  label: meta.value,
                  value: e.target.checked,
                },
              });
            }}
          />
          <Label htmlFor={meta.name} label={meta.value} />
        </div>
      )}
    </Header>
  );

CheckboxInput.defaultProps = {
  hasError: () => {},
};

CheckboxInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
};

export default CheckboxInput;
