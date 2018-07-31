import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

import messages from './messages';
import './style.scss';
import { makeSelectIsAuthenticated } from '../../containers/App/selectors';

export class MainMenu extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="row main-menu-component no-print">
        <div className="container type-nav-primair">
          <nav>
            <ul className="links horizontal">
              <li>
                <NavLink to="/">
                  <span className="linklabel">
                    <FormattedMessage {...messages.incident} />
                  </span>
                </NavLink>
              </li>
              {this.props.isAuthenticated ?
                <li>
                  <NavLink to="/manage/incidents">
                    <span className="linklabel">
                      <FormattedMessage {...messages.afhandelen} />
                    </span>
                  </NavLink>
                </li> : ''
              }
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

MainMenu.propTypes = {
  isAuthenticated: PropTypes.bool
};


export const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated()
});

const withConnect = connect(mapStateToProps, null);

export default compose(
  withConnect,
)(MainMenu);
