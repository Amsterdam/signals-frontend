import React, { Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import isObject from 'lodash.isobject';
import { themeColor, themeSpacing, RadioGroup } from '@amsterdam/asc-ui';

import Header from '../Header';
import RadioInput from '../RadioInput';

const Info = styled.p`
  color: ${themeColor('tint', 'level5')};
`;

const StyledRadioGroup = styled(RadioGroup)`
  margin-top: -6px; // Offset spacing introduced by asc-ui RadioGroup
`;

const RadioInputGroup = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => {
  const currentSelected = parent.meta.incident && parent.meta.incident[meta.name];
  let info;
  let label;

  if (currentSelected && meta.values && meta.values[currentSelected.id]) {
    ({ info, value: label } = meta.values[currentSelected.id]);
  }

  if (!meta.isVisible) return null;

  return (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      {meta.values && isObject(meta.values) && (
        <div>
          <StyledRadioGroup
            role="radiogroup"
            id={meta.name}
            name={meta.name}
            aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
          >
            {Object.entries(meta.values).map(([key, value]) => (
              <RadioInput
                checked={handler().value.id === key}
                id={key}
                idAttr={`${meta.name}-${key + 1}`}
                info={value.info}
                key={key}
                label={value.value || value}
                name={meta.name}
                resetsStateOnChange={meta.resetsStateOnChange}
              />
            ))}
          </StyledRadioGroup>
          {info && (
            <Info data-testid={`${meta.name}--info`}>
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
