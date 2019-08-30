/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Media from 'react-media';

import CONFIGURATION from 'shared/services/configuration/configuration';

import { Login, Logout } from '@datapunt/asc-assets';

import {
  Header as HeaderComponent,
  MenuInline,
  MenuItem,
  MenuButton,
  MenuToggle,
} from '@datapunt/asc-ui';

import { resetIncident } from '../../signals/incident/containers/IncidentContainer/actions';

export const breakpoint = 899;

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
}) => (
  <Fragment>
    {isAuthenticated && (
    <StyledMenuItem element="span">
      <MenuButton>
        <NavLink to="/manage/incidents">Afhandelen</NavLink>
      </MenuButton>
    </StyledMenuItem>
      )}
    <StyledMenuItem element="span">
      <MenuButton>
        <NavLink to="/" onClick={resetIncident}>
          Nieuwe melding
        </NavLink>
      </MenuButton>
    </StyledMenuItem>
    {permissions.includes('signals.sia_statusmessagetemplate_write') && (
    <StyledMenuItem element="span">
      <MenuButton>
        <NavLink to="/manage/standaard/teksten">
            Beheer standaard teksten
        </NavLink>
      </MenuButton>
    </StyledMenuItem>
      )}
    {isAuthenticated && (
    <StyledMenuItem
      element="button"
      data-testid="logout-button"
      onClick={onLoginLogoutButtonClick}
    >
      <MenuButton
        iconLeft={<Logout focusable="false" width={20} />}
      >
          Uitloggen
      </MenuButton>
    </StyledMenuItem>
      )}
    {isAuthenticated && (
    <StyledMenuItem
      element="button"
      data-testid="login-button"
      onClick={onLoginLogoutButtonClick}
    >
      <MenuButton
        iconLeft={<Login focusable="false" width={20} />}
      >
          Log in
      </MenuButton>
    </StyledMenuItem>
      )}
  </Fragment>
  );

const SiteHeader = (props) => (
  <StyledHeader
    title={props.isAuthenticated ? 'Meldingen' : ''}
    homeLink={CONFIGURATION.ROOT}
    tall={!props.isAuthenticated}
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
