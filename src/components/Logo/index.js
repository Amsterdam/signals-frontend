import React from 'react';
import PropTypes from 'prop-types';
import configuration from 'shared/services/configuration/configuration';

export const Logo = props => (
  <a href={props.tall ? configuration.links.home : '/'}>
    <img
      alt="Logo"
      src={configuration.logo.url}
      width={props.tall ? configuration.logo.width : configuration.logo.smallWidth}
      height={props.tall ? configuration.logo.height : configuration.logo.smallHeight}
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
