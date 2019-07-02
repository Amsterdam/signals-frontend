import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import './style.scss';
import { makeSelectIsAuthenticated, makeSelectUserPermissions } from '../../containers/App/selectors';
import { resetIncident } from '../../signals/incident/containers/IncidentContainer/actions';
import messages from './messages';

export class MainMenu extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.resetIncident = this.resetIncident.bind(this);
  }

  resetIncident(e) {
    e.stopPropagation();

    this.props.resetIncident();
  }

  render() {
    const { permissions } = this.props;
    return (
      <div className="row main-menu-component no-print">
        <div className="container type-nav-primair">
          <nav>
            <ul className="links horizontal">
              <li>
                <NavLink to="/" onClick={this.resetIncident}>
                  <span className="linklabel">
                    <FormattedMessage {...messages.new_melding} />
                  </span>
                </NavLink>
              </li>
              {this.props.isAuthenticated &&
                <li>
                  <NavLink to="/manage/incidents">
                    <span className="linklabel">
                      <FormattedMessage {...messages.afhandelen} />
                    </span>
                  </NavLink>
                </li>
              }
              {permissions.includes('signals.sia_statusmessagetemplate_write') &&
                <li>
                  <NavLink to="/manage/standaard/teksten">
                    <span className="linklabel">
                      <FormattedMessage {...messages.manage_standaard_teksten} />
                    </span>
                  </NavLink>
                </li>
              }
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

MainMenu.defaultProps = {
  permissions: []
};

MainMenu.propTypes = {
  isAuthenticated: PropTypes.bool,
  permissions: PropTypes.array,
  resetIncident: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
  permissions: makeSelectUserPermissions()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  resetIncident
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(MainMenu);
