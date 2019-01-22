import React from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';

const Concat = ({ items }) => (
  <span>{items && items.map && items.map((item) => {
    let key = item;

    if (React.isValidElement(item) && item.props.items) {
      if (isArray(item.props.items)) {
        key = item.props.items.join('-');
      } else {
        key = item.props.items;
      }
    }

    return <span key={key}>{item}</span>;
  })}
  </span>
);

Concat.propTypes = {
  items: PropTypes.array.isRequired
};

export default Concat;
