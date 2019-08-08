import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Media from 'react-media';

import CONFIGURATION from 'shared/services/configuration/configuration';
import LoginIcon from '@datapunt/asc-assets/lib/Icons/Login.svg';
import LogoutIcon from '@datapunt/asc-assets/lib/Icons/Logout.svg';
import {
  Header as HeaderComponent,
  MenuInline,
  MenuItem,
  MenuToggle,
} from '@datapunt/asc-ui';
import { resetIncident } from '../../signals/incident/containers/IncidentContainer/actions';

export const breakpoint = 899;

const StyledLogin = styled(LoginIcon)`
  margin-right: 5px;
`;

const StyledLogout = styled(LogoutIcon)`
  margin-right: 5px;
`;

const StyledHeader = styled(HeaderComponent)`
  a:link {
    text-decoration: none;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  button {
    background: transparent;
  }
`;

const MenuItems = ({
  isAuthenticated,
  onLoginLogoutButtonClick,
  permissions,
  location: { pathname },
}) => {
  const showLogin = pathname !== '/incident/beschrijf' && !isAuthenticated;
  const showLogout = isAuthenticated;

  return (
    <Fragment>
      <StyledMenuItem element="span">
        <NavLink to="/" onClick={resetIncident}>
          Nieuwe melding
        </NavLink>
      </StyledMenuItem>
      {isAuthenticated && (
        <StyledMenuItem element="span">
          <NavLink to="/manage/incidents">Afhandelen</NavLink>
        </StyledMenuItem>
      )}
      {permissions.includes('signals.sia_statusmessagetemplate_write') && (
        <StyledMenuItem element="span">
          <NavLink to="/manage/standaard/teksten">
            Beheer standaard teksten
          </NavLink>
        </StyledMenuItem>
      )}
      {showLogout && (
        <StyledMenuItem
          element="button"
          data-testid="logout-button"
          onClick={onLoginLogoutButtonClick}
          iconLeft={<StyledLogout focusable="false" width={20} />}
        >
          Uitloggen
        </StyledMenuItem>
      )}
      {showLogin && (
        <StyledMenuItem
          element="button"
          data-testid="login-button"
          onClick={onLoginLogoutButtonClick}
          iconLeft={<StyledLogin focusable="false" width={20} />}
        >
          Log in
        </StyledMenuItem>
      )}
    </Fragment>
  );
};

const SiteHeader = (props) => (
  <StyledHeader
    title="Meldingen"
    homeLink={CONFIGURATION.ROOT}
    tall={false}
    fullWidth={false}
    navigation={
      <Media query={`(max-width: ${breakpoint}px)`}>
        {(matches) =>
          matches ? (
            <MenuToggle align="right">
              <MenuItems {...props} />
            </MenuToggle>
          ) : (
            <MenuInline>
              <MenuItems {...props} />
            </MenuInline>
          )
        }
      </Media>
    }
  />
);

SiteHeader.defaultProps = {
  isAuthenticated: false,
  onLoginLogoutButtonClick: undefined,
};

SiteHeader.propTypes = {
  isAuthenticated: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  onLoginLogoutButtonClick: PropTypes.func,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

MenuItems.propTypes = SiteHeader.propTypes;

export default SiteHeader;
