import React from 'react';
import PropTypes from 'prop-types';

const Anchor = ({
  href, target, className, children,
}) => <a href={href} className={className} target={target}>{children}</a>;

Anchor.defaultProps = {
  target: '_self',
  className: '',
};

Anchor.propTypes = {
  children: PropTypes.any,
  href: PropTypes.string.isRequired,
  target: PropTypes.string,
  className: PropTypes.string,
};

export default Anchor;
