import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import CONFIGURATION from 'shared/services/configuration/configuration';
import LoginIcon from '@datapunt/asc-assets/lib/Icons/Login.svg';
import LogoutIcon from '@datapunt/asc-assets/lib/Icons/Logout.svg';
import { Header as HeaderComponent } from '@datapunt/asc-ui';
import { resetIncident } from '../../signals/incident/containers/IncidentContainer/actions';

const StyledHeader = styled(HeaderComponent)`
  max-width: 1080px;
  margin: 0 auto;

  a {
    line-height: normal;
  }

  h1 {
    padding: 0 !important;

    a {
      font-weight: normal !important;
    }
  }
`;

const HeaderWrapper = styled.div`
  position: relative;
  z-index: 2;
`;

const StyledNav = styled.nav`
  // position: absolute;
  // top: 5px;
  // right: 20px;
  // z-index: 101;

  button {
    appearance: none;
    background: none;
    border: 0;
    cursor: pointer;

    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
      height: 30px;
    }

    & > * {
      vertical-align: middle;
      margin-right: 5px;
    }

    &:hover,
    &:focus {
      color: #ec0000;
      text-decoration: underline;

      svg {
        fill: #ec0000;
      }
    }
  }

  @media (max-width: 720px) {
    right: 0;

    .login-adw,
    span {
      display: none;
    }
  }
`;

const Header = ({
  isAuthenticated,
  userName,
  onLoginLogoutButtonClick,
  permissions,
}) => (
  <HeaderWrapper data-testid="site-header">
    <StyledHeader
      title="Meldingen"
      homeLink={CONFIGURATION.ROOT}
      tall={false}
      fullWidth={false}
      navigation={
        <Fragment>
          <StyledNav>
            {isAuthenticated ? (
              <li>
                Ingelogd als: <strong>{userName}</strong>
                <button
                  type="button"
                  className="header-component__logout"
                  onClick={onLoginLogoutButtonClick}
                >
                  <LogoutIcon focusable="false" width={20} />
                  <span>Uitloggen</span>
                </button>
              </li>
            ) : (
              <li>
                <button
                  className="login"
                  type="button"
                  onClick={onLoginLogoutButtonClick}
                >
                  <LoginIcon focusable="false" width={20} />
                  <span>Log in</span>
                </button>
              </li>
            )}
          </StyledNav>
          <ul className="links horizontal">
            <li>
              <NavLink to="/" onClick={resetIncident}>
                <span className="linklabel">Nieuwe melding</span>
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to="/manage/incidents">
                  <span className="linklabel">Afhandelen</span>
                </NavLink>
              </li>
            )}
            {permissions.includes(
              'signals.sia_statusmessagetemplate_write',
            ) && (
              <li>
                <NavLink to="/manage/standaard/teksten">
                  <span className="linklabel">Beheer standaard teksten</span>
                </NavLink>
              </li>
            )}
          </ul>
        </Fragment>
      }
    />
  </HeaderWrapper>
);

Header.defaultProps = {
  isAuthenticated: false,
  onLoginLogoutButtonClick: undefined,
  userName: '',
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool,
  onLoginLogoutButtonClick: PropTypes.func,
  userName: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Header;
