import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import NotFoundPage from 'containers/NotFoundPage';
import Footer from 'components/Footer';
import MainMenu from 'components/MainMenu';
import HeaderContainer from 'containers/HeaderContainer';
import GlobalError from 'containers/GlobalError';

import reducer from './reducer';
import saga from './saga';
import IncidentManagementModule from '../../signals/incident-management';
import IncidentContainer from '../../signals/incident/containers/IncidentContainer';
import { requestCategories } from './actions';

export class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.requestCategories();
  }

  render() {
    return (
      <div className="container app-container">
        <GlobalError />
        <div className="container">
          <HeaderContainer />
        </div>
        <div className="container-fluid">
          <MainMenu />
        </div>
        <div className="content">
          <Switch>
            <Redirect exact from="/" to="/incident" />
            <Redirect exact from="/login" to="/manage" />
            <Route path="/manage" component={IncidentManagementModule} />
            <Route path="/incident" component={IncidentContainer} />
            <Route path="" component={NotFoundPage} />
          </Switch>
        </div>
        <div className="container-fluid">
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  requestCategories: PropTypes.func.isRequired
};

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestCategories
}, dispatch);

const withConnect = connect(null, mapDispatchToProps);

const withReducer = injectReducer({ key: 'global', reducer });
const withSaga = injectSaga({ key: 'global', saga });

export default compose(
  withReducer,
  withSaga,
  withRouter,
  withConnect
)(App);
