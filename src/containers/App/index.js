import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ThemeProvider } from '@datapunt/asc-ui';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import NotFoundPage from 'containers/NotFoundPage';
import Footer from 'components/Footer';
import SiteHeaderContainer from 'containers/SiteHeader';
import GlobalError from 'containers/GlobalError';

import reducer from './reducer';
import saga from './saga';
import IncidentManagementModule from '../../signals/incident-management';
import IncidentContainer from '../../signals/incident/containers/IncidentContainer';
import KtoContainer from '../../signals/incident/containers/KtoContainer';
import { requestCategories } from './actions';

export class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.requestCategories();
  }

  render() {
    return (
      <ThemeProvider>
        <Fragment>
          <SiteHeaderContainer />
          <div className="app-container">
            <GlobalError />
            <Switch>
              <Redirect exact from="/" to="/incident" />
              <Redirect exact from="/login" to="/manage" />
              <Route path="/manage" component={IncidentManagementModule} />
              <Route path="/incident" component={IncidentContainer} />
              <Route
                path="/kto/:yesNo/:uuid"
                component={(props) => (
                  <KtoContainer
                    yesNo={props.match.params.yesNo}
                    uuid={props.match.params.uuid}
                  />
                )}
              />
              <Route path="" component={NotFoundPage} />
            </Switch>
          </div>
          <Footer />
        </Fragment>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  requestCategories: PropTypes.func.isRequired,
};

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      requestCategories,
    },
    dispatch,
  );

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'global', reducer });
const withSaga = injectSaga({ key: 'global', saga });

export default compose(
  withReducer,
  withSaga,
  withRouter,
  withConnect,
)(App);
