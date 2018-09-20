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
import { resetIncident } from '../../signals/incident/containers/IncidentContainer/actions';

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
    return (
      <div className="row main-menu-component no-print">
        <div className="container type-nav-primair">
          <nav>
            <ul className="links horizontal">
              <li>
                <NavLink to="/" onClick={this.resetIncident}>
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
  isAuthenticated: PropTypes.bool,
  resetIncident: PropTypes.func
};

export const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated()
});

function mapDispatchToProps(dispatch) {
  return {
    resetIncident: (incident) => dispatch(resetIncident(incident))
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(MainMenu);
