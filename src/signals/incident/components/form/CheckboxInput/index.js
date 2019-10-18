import React from 'react';
import PropTypes from 'prop-types';
import { map, isObject } from 'lodash';

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

const CheckboxInput = ({
  handler, touched, hasError, meta, parent, getError, validatorsOrOpts,
}) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible
      ? (
        <div className={`${meta.className || 'col-12'} mode_input`}>
          <Header
            meta={meta}
            options={validatorsOrOpts}
            touched={touched}
            hasError={hasError}
            getError={getError}
          >
            <div className="antwoorden">
              {isObject(meta.values)
                ? (
                  <div>
                    <input
                      type="hidden"
                      {...handler()}
                    />

                    {map(meta.values, (value, key) => (
                      <div key={value} className="antwoord">
                        <input
                          id={`${meta.name}-${key + 1}`}
                          name={`${meta.name}-${key + 1}`}
                          type="checkbox"
                          value={key}
                          defaultChecked={(handler().value || []).find(item => item.id === key)}
                          onClick={e => updateIncidentCheckboxMulti(e.target.checked, value, key, handler().value, meta, parent)}
                        />
                        <label htmlFor={`${meta.name}-${key + 1}`}>{value}</label>
                      </div>
                    ))}
                  </div>
                )
                : (
                  <div className="antwoord">
                    <input
                      id={meta.name}
                      name={meta.name}
                      type="checkbox"
                      defaultChecked={handler().value.value}
                      onClick={e => parent.meta.updateIncident({
                        [meta.name]: {
                          label: meta.value,
                          value: e.target.checked,
                        },
                      })}
                    />
                    <label htmlFor={meta.name}>{meta.value}</label>
                  </div>
                )}
            </div>
          </Header>
        </div>
      )
      : ''}
  </div>
);

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
