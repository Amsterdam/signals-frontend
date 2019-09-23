import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { ThemeProvider as AscThemeProvider } from '@datapunt/asc-ui';

import AmsThemeProvider from 'components/ThemeProvider';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import NotFoundPage from 'containers/NotFoundPage';
import Footer from 'components/Footer';
import SiteHeaderContainer from 'containers/SiteHeader';
import GlobalError from 'containers/GlobalError';
import { makeSelectIsAuthenticated } from 'containers/App/selectors';

import reducer from './reducer';
import saga from './saga';
import IncidentManagementModule from '../../signals/incident-management';
import IncidentContainer from '../../signals/incident/containers/IncidentContainer';
import KtoContainer from '../../signals/incident/containers/KtoContainer';
import { requestCategories } from './actions';

const ThemeWrapper = styled.div``;

export class App extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.requestCategories();
  }

  render() {
    return (
      // eslint-disable-next-line react/destructuring-assignment
      <ThemeWrapper as={this.props.isAuthenticated ? AscThemeProvider : AmsThemeProvider}>
        <Fragment>
          {/**
           * Forcing rerender of SiteHeader component to reevaluate its props, because it will
           * otherwise not pick up a navigation action and will not present the component as tall
           */}
          <SiteHeaderContainer key={Math.random()} />

          <div className="app-container">
            <GlobalError />
            <Switch>
              <Redirect exact from="/" to="/incident" />
              <Redirect exact from="/login" to="/manage" />
              <Route path="/manage" component={IncidentManagementModule} />
              <Route path="/incident" component={IncidentContainer} />
              <Route
                path="/kto/:yesNo/:uuid"
                component={props => <KtoContainer yesNo={props.match.params.yesNo} uuid={props.match.params.uuid} />}
              />
              <Route path="" component={NotFoundPage} />
            </Switch>
          </div>
          <Footer />
        </Fragment>
      </ThemeWrapper>
    );
  }
}

App.propTypes = {
  requestCategories: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      requestCategories,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
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
