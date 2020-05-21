import React from 'react';
import configuration from 'shared/services/configuration/configuration';

export const Logo = props => (
  <a href={configuration.links.home}>
    <img alt="Logo" src={configuration.logoUrl} height={configuration.logoHeight} {...props} />
  </a>
);

export default Logo;
