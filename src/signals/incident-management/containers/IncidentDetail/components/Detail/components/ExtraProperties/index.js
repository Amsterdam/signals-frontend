import React from 'react';
import PropTypes from 'prop-types';
import isObject from 'lodash.isobject';
import isArray from 'lodash.isarray';
import isBoolean from 'lodash.isboolean';

const getValue = (answer) => {
  if (isArray(answer)) {
    return answer.map((item) => isObject(item) ? item.label : item).join(', ');
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
  <div className="extra-properties">
    {items && items.map((item) =>
      (<dl key={item.id}>
        <dt className="detail__definition">{item.label}</dt>
        <dd className="detail__value">{getValue(item.answer)}</dd>
      </dl>)
    )}
  </div>
);

ExtraProperties.defaultProps = {
  items: []
};

ExtraProperties.propTypes = {
  items: PropTypes.array
};

export default ExtraProperties;
