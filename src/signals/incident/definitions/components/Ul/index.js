import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash.isarray';

const Ul = ({ items }) => (
  <ul>
    {items && items.map && items.map(item => {
      let key = item;
      if (React.isValidElement(item)) {
        if (item.props.items && isArray(item.props.items)) {
          key = item.props.items.join('-');
        } else if (item.props.children) {
          key = item.props.children;
        }
      }

      return <li key={key}>{item}</li>;
    })}
  </ul>
);

Ul.propTypes = {
  items: PropTypes.array.isRequired,
};

export default Ul;
