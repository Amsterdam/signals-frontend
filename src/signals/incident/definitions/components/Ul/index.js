import React from 'react';
import PropTypes from 'prop-types';

const Ul = ({ items }) =>
  <ul>{items && items.map && items.map((item) => (<li key={item}>{item}</li>))}</ul>;

Ul.propTypes = {
  items: PropTypes.array.isRequired
};

export default Ul;
