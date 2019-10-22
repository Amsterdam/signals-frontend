import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash.isarray';

const Concat = ({ items }) => (
  <span>
    {items && items.map && items.map(item => {
      let key = item;
      if (React.isValidElement(item)) {
        if (item.props.items && isArray(item.props.items)) {
          key = item.props.items.join('-');
        } else if (item.props.children) {
          key = item.props.children;
        }
      }

      return <span key={key}>{item}</span>;
    })}
  </span>
);

Concat.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default Concat;
