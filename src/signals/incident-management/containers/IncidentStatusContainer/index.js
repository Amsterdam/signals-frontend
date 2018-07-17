import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectIncidentStatusContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';
import List from './components/List';
import Add from './components/Add';
import { requestStatusList, requestStatusCreate } from './actions';
import messages from './messages';

export class IncidentStatusContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onRequestStatusList(this.props.id);
  }

  render() {
    const { incidentStatusList, statusList, error } = this.props.incidentstatuscontainer;
    const state = incidentStatusList && incidentStatusList.length && incidentStatusList[incidentStatusList.length - 1].state;
    const canDisplay = typeof state !== 'number';
    const canChangeState = !['a', 'o'].some((value) => state === value);

    return (
      <div>
        {canDisplay ?
          <div className="incident-status-container row">
            <div className="col-12">
              {canChangeState ? <Add id={this.props.id} statusList={statusList} onRequestStatusCreate={this.props.onRequestStatusCreate} incidentStatusList={incidentStatusList} /> : ''}
              {error ? <div className="incident-status-container__error" ><FormattedMessage {...messages.errorStateTransition} /></div> : ''}
            </div>
            <div className="col-12">
              <List incidentStatusList={incidentStatusList} statusList={statusList} />
            </div>
          </div> : ''}
      </div>
    );
  }
}

IncidentStatusContainer.propTypes = {
  id: PropTypes.string.isRequired,
  incidentstatuscontainer: PropTypes.object.isRequired,

  onRequestStatusList: PropTypes.func.isRequired,
  onRequestStatusCreate: PropTypes.func.isRequired,
};


const mapStateToProps = createStructuredSelector({
  incidentstatuscontainer: makeSelectIncidentStatusContainer(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestStatusList: requestStatusList,
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
