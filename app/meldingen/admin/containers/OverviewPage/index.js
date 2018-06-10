import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import makeSelectOverviewPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './style.scss';

import { requestIncidents } from './actions';


export class OverviewPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.requestIncidents();
  }

  render() {
    const { incidents } = this.props.overviewpage;
    const { loading } = this.props;
    return (
      <div className="overview-page">
        <FormattedMessage {...messages.header} /> - loading: {loading.toString()}
        <br />There are {incidents.length} found.
        <br />{JSON.stringify(incidents)}


      </div>
    );
  }
}

OverviewPage.propTypes = {
  overviewpage: PropTypes.object.isRequired,
  requestIncidents: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  // error: PropTypes.oneOfType([
  //   PropTypes.object,
  //   PropTypes.bool,
  // ]),
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  overviewpage: makeSelectOverviewPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    requestIncidents: (filter) => dispatch(requestIncidents(filter)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'overviewPage', reducer });
const withSaga = injectSaga({ key: 'overviewPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(OverviewPage);
