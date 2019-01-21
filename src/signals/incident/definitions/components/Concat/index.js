
import React from 'react';
import PropTypes from 'prop-types';

const Concat = ({ items }) =>
  <span>{items && items.map && items.map((item) => (<span key={item}>{item}</span>))}</span>;

Concat.propTypes = {
  items: PropTypes.array.isRequired
};

export default Concat;
