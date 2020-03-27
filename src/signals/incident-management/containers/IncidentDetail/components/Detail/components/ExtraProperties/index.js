import React from 'react';
import styled from 'styled-components';
import isObject from 'lodash.isobject';
import isArray from 'lodash.isarray';
import isBoolean from 'lodash.isboolean';
import { themeSpacing } from '@datapunt/asc-ui';

import { extraPropertiesType } from 'shared/types';

const Wrapper = styled.dl`
  margin-bottom: ${themeSpacing(4)};
`;

const getValue = answer => {
  if (isArray(answer)) {
    return answer.map(item => (isObject(item) ? item.label : item)).join(', ');
  }
  if (isObject(answer)) {
    if (isBoolean(answer.value)) {
      return answer.value ? answer.label : 'Nee';
    }
    return answer.label;
  }

  return answer;
};

const ExtraProperties = ({ items }) => (
  <Wrapper data-testid="detail-extra-properties">
    {items &&
      items.map(item => (
        <dl key={item.id}>
          <dt className="detail__definition" data-testid="extra-properties-definition">
            {item.label}
          </dt>
          <dd className="detail__value" data-testid="extra-properties-value">
            {getValue(item.answer)}
          </dd>
        </dl>
      ))}
  </Wrapper>
);

ExtraProperties.defaultProps = {
  items: [],
};

ExtraProperties.propTypes = {
  items: extraPropertiesType,
};

export default ExtraProperties;
