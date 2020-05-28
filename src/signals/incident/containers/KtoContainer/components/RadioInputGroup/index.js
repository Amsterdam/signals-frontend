import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import isObject from 'lodash.isobject';
import { Label, Radio, RadioGroup, themeSpacing } from '@datapunt/asc-ui';

import Header from 'signals/incident/components/form/Header';

const StyledHeader = styled(Header)`
  margin-top: ${themeSpacing(5)};
`;

const RadioInputGroup = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => {
  if (!meta?.isVisible) return null;

  return (
    <StyledHeader meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      {meta.values && isObject(meta.values) && (
        <RadioGroup name={meta.name}>
          {Object.entries(meta.values).map(([key, value]) => (
            <Label htmlFor={key} key={key} label={value.value || value}>
              <Radio
                checked={handler().value.id === key}
                id={key}
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
            </Label>
          ))}
        </RadioGroup>
      )}
    </StyledHeader>
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
