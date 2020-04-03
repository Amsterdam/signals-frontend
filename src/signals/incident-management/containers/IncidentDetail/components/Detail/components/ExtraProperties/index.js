import React, { Fragment } from 'react';
import isObject from 'lodash.isobject';
import isArray from 'lodash.isarray';
import isBoolean from 'lodash.isboolean';

import { extraPropertiesType } from 'shared/types';

const getValue = answer => {
  if (isArray(answer)) {
    return answer.map(item => isObject(item) ? item.label : item).join(', ');
  }
  if (isObject(answer)) {
    if (isBoolean(answer.value)) {
      return answer.value ? answer.label : 'Nee';
    }
    return answer.label;
  }

  return answer;
};

const ExtraProperties = ({ items }) =>
  items &&
  items.map(item => (
    <Fragment key={item.id}>
      <dt data-testid="extra-properties-definition">{item.label}</dt>
      <dd data-testid="extra-properties-value">{getValue(item.answer)}</dd>
    </Fragment>
  ));

ExtraProperties.defaultProps = {
  items: [],
};

ExtraProperties.propTypes = {
  items: extraPropertiesType,
};

export default ExtraProperties;
