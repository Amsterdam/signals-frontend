import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectIncidentStatusContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './style.scss';
import List from './components/List';
import Add from './components/Add';
import { requestsStatusList, requestStatusCreate } from './actions';


export class IncidentStatusContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onRequestStatusList(this.props.id);
  }

  render() {
    return (
      <div className="incident-status-container">
        <FormattedMessage {...messages.header} />
        <List />
        <Add />
      </div>
    );
  }
}

IncidentStatusContainer.propTypes = {
  id: PropTypes.string.isRequired,
  onRequestStatusList: PropTypes.func.isRequired,
  // onRequestStatusCreate: PropTypes.func.isRequired,
};


const mapStateToProps = createStructuredSelector({
  incidentstatuscontainer: makeSelectIncidentStatusContainer(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestStatusList: requestsStatusList,
  onRequestStatusCreate: requestStatusCreate,
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentStatusContainer', reducer });
const withSaga = injectSaga({ key: 'incidentStatusContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentStatusContainer);
