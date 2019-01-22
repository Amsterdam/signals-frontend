import React from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';

const Ul = ({ items }) => (
  <ul>{items && items.map && items.map((item) => {
    let key = item;

    if (React.isValidElement(item) && item.props.items) {
      if (isArray(item.props.items)) {
        key = item.props.items.join('-');
      } else {
        key = item.props.items;
      }
    }

    return <li key={key}>{item}</li>;
  })}
  </ul>
);

Ul.propTypes = {
  items: PropTypes.array.isRequired
};

export default Ul;
