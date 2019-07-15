import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import Footer from 'components/Footer';
import MainMenu from 'components/MainMenu';
import HeaderContainer from 'containers/HeaderContainer';
import GlobalError from 'containers/GlobalError';

import reducer from './reducer';
import saga from './saga';
import { requestCategories } from './actions';
import Router from './router';

export class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.requestCategories();
  }

  render() {
    return (
      <div className="app-container container-fluid">
        <GlobalError />
        <div className="container">
          <HeaderContainer />
        </div>
        <div className="container-fluid">
          <MainMenu />
        </div>
        <div className="container content">
          <Router />
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
