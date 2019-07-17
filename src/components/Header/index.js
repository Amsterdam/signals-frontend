import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

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

const MenuItems = ({
  isAuthenticated,
  onLoginLogoutButtonClick,
  permissions,
}) => (
  <Fragment>
    <MenuItem element="span">
      <NavLink to="/" onClick={resetIncident}>
        Nieuwe melding
      </NavLink>
    </MenuItem>
    {isAuthenticated && (
      <MenuItem element="span">
        <NavLink to="/manage/incidents">Afhandelen</NavLink>
      </MenuItem>
    )}
    {permissions.includes('signals.sia_statusmessagetemplate_write') && (
      <MenuItem element="span">
        <NavLink to="/manage/standaard/teksten">
          Beheer standaard teksten
        </NavLink>
      </MenuItem>
    )}
    {isAuthenticated ? (
      <MenuItem
        onClick={onLoginLogoutButtonClick}
        iconRight={<LogoutIcon focusable="false" width={20} />}
      >
        Uitloggen
      </MenuItem>
    ) : (
      <MenuItem
        element="span"
        onClick={onLoginLogoutButtonClick}
        iconRight={<LoginIcon focusable="false" width={20} />}
      >
        Log in
      </MenuItem>
    )}
  </Fragment>
);

const Header = (props) => (
  <HeaderComponent
    title="Meldingen"
    homeLink={CONFIGURATION.ROOT}
    tall={false}
    fullWidth={false}
    navigation={
      <Fragment>
        <MenuInline showAt="laptopM">
          <MenuItems {...props} />
        </MenuInline>
        <MenuToggle align="right" hideAt="laptopM">
          <MenuItems {...props} />
        </MenuToggle>
      </Fragment>
    }
  />
);

Header.defaultProps = {
  isAuthenticated: false,
  onLoginLogoutButtonClick: undefined,
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool,
  onLoginLogoutButtonClick: PropTypes.func,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

MenuItems.propTypes = Header.propTypes;

export default Header;
