import React, { Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import isObject from 'lodash.isobject';
import { themeColor, RadioGroup } from '@amsterdam/asc-ui';

import Header from '../Header';
import RadioInput from '../RadioInput';

const Info = styled.p`
  color: ${themeColor('tint', 'level5')};
`;

const RadioInputGroup = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => {
  const currentSelected = parent.meta.incident && parent.meta.incident[meta.name];
  let info;
  let label;

  if (currentSelected && meta?.values[currentSelected.id]) {
    ({ info, value: label } = meta.values[currentSelected.id]);
  }

  if (!meta?.isVisible) return null;

  return (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      {meta.values && isObject(meta.values) && (
        <div>
          <RadioGroup name={meta.name}>
            {Object.entries(meta.values).map(([key, value]) => (
              <RadioInput
                checked={handler().value.id === key}
                id={key}
                idAttr={`${meta.name}-${key + 1}`}
                info={value?.info}
                key={key}
                label={value.value || value}
                name={meta.name}
                resetsStateOnChange={meta.resetsStateOnChange}
              />
            ))}
          </RadioGroup>
          {info && (
            <Info>
              {label}: {info}
            </Info>
          )}
        </div>
      )}
    </Header>
  );
};

RadioInputGroup.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
};

export default RadioInputGroup;
