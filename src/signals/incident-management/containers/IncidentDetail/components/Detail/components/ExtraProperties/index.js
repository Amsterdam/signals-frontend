import React, { Fragment } from 'react';
import isObject from 'lodash.isobject';
import isBoolean from 'lodash.isboolean';

import { extraPropertiesType } from 'shared/types';

const getValue = answer => {
  if (Array.isArray(answer)) {
    return answer.map((item, index) => {
      const id = isObject(item) ? item.label || item.id : item;
      const label = isObject(item) ? item.label || `${item.description} - ${item.id}` : item;

      return <div key={id}>{label}</div>;
    });
  }

  if (isObject(answer)) {
    if (isBoolean(answer.value)) {
      return answer.value ? answer.label : 'Nee';
    }

    return answer.label;
  }

  return answer;
};

const ExtraProperties = ({ items }) => {
  // Some incidents have been stored with values for their extra properties that is incompatible with the current API
  // We therefore need to check if we're getting an array or an object
  const itemList = Array.isArray(items)
    ? items
    : Object.entries(items).map(([label, answer], index) => ({ label, answer, id: index }));

  return itemList.map(item => (
    <Fragment key={item.id}>
      <dt data-testid="extra-properties-definition">{item.label}</dt>
      <dd data-testid="extra-properties-value">{getValue(item.answer)}</dd>
    </Fragment>
  ));
};

ExtraProperties.defaultProps = {
  items: [],
};

ExtraProperties.propTypes = {
  items: extraPropertiesType,
};

export default ExtraProperties;
