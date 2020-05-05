import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import isObject from 'lodash.isobject';
import { themeColor } from '@datapunt/asc-ui';

import Header from '../Header';

const Info = styled.p`
  color: ${themeColor('tint', 'level5')};
`;

const RadioInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => {
  const currentSelected = parent.meta.incident && parent.meta.incident[meta.name];
  let info;
  let label;

  if (currentSelected && meta?.values[currentSelected.id]) {
    ({ info, value: label } = meta.values[currentSelected.id]);
  }

  return (
    <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
      {meta && meta.isVisible ? (
        <div className={`${meta.className || 'col-12'} mode_input`}>
          <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
            <div className="antwoorden">
              {meta.values &&
                isObject(meta.values) &&
                Object.entries(meta.values).map(([key, value]) => (
                  <div className="antwoord" key={key}>
                    <input
                      id={`${meta.name}-${key + 1}`}
                      className="kenmerkradio"
                      type="radio"
                      checked={handler().value.id === key}
                      onChange={() => {
                        parent.meta.updateIncident({
                          [meta.name]: {
                            id: key,
                            label: value.value || value,
                            info: value.info,
                          },
                        });
                      }}
                    />
                    <label htmlFor={`${meta.name}-${key + 1}`}>{value.value || value}</label>
                  </div>
                ))}

              {info && (
                <Info>
                  {label}: {info}
                </Info>
              )}
            </div>
          </Header>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

RadioInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
};

export default RadioInput;
