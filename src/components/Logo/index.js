import React from 'react';
import PropTypes from 'prop-types';
import configuration from 'shared/services/configuration/configuration';

export const Logo = props => (
  <a href={props.tall ? configuration.links.home : '/'}>
    <img
      alt="Logo"
      src={configuration.logoUrl}
      width={props.tall ? configuration.logoWidth : configuration.logoWidthSmall}
      height={props.tall ? configuration.logoHeight : configuration.logoHeightSmall}
      {...props}
    />
  </a>
);

Logo.defaultProps = {
  tall: true,
};

Logo.propTypes = {
  tall: PropTypes.bool,
};

export default Logo;
