import React from 'react';
import PropTypes from 'prop-types';
import configuration from 'shared/services/configuration/configuration';

export const Logo = ({ tall, ... props }) => (
  <a href={tall ? configuration.links.home : '/'}>
    <img
      alt="Logo"
      src={configuration.logo.url}
      width={tall ? configuration.logo.width : configuration.logo.smallWidth}
      height={tall ? configuration.logo.height : configuration.logo.smallHeight}
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
