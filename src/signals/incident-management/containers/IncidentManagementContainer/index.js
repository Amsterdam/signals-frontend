import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Route } from 'react-router-dom';

import LoginPage from 'components/LoginPage';
import { makeSelectIsAuthenticated } from 'containers/App/selectors';

import OverviewPage from '../OverviewPage';
import IncidentDetailPage from '../IncidentDetailPage';

import './style.scss';


export class IncidentManagementContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { isAuthenticated } = this.props;
    const baseUrl = this.props.match.url;
    const IncidentDetailPageWrapper = (props) => (<IncidentDetailPage id={props.match.params.id} baseUrl={baseUrl} />);
    const OverviewPageWrapper = () => (<OverviewPage baseUrl={baseUrl} />);

    return (
      <div className="manage-incident">
        {
          !isAuthenticated ? (
            <Route component={LoginPage} />
          ) : (
            <div className="row">
              <div className="col-12">
                <Route exact path={`${baseUrl}/incidents`} render={OverviewPageWrapper} />
                <Route exact path={`${baseUrl}/incident/:id`} render={IncidentDetailPageWrapper} />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

IncidentManagementContainer.propTypes = {
  dispatch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  match: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(IncidentManagementContainer);
