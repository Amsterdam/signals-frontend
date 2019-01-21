import React from 'react';
import PropTypes from 'prop-types';

const A = ({ href, target, className, children }) =>
  <a href={href} className={className} target={target}>{children}</a>;

A.defaultProps = {
  target: '_self',
  className: ''
};

A.propTypes = {
  children: PropTypes.any,
  href: PropTypes.string.isRequired,
  target: PropTypes.string,
  className: PropTypes.string,
};

export default A;
