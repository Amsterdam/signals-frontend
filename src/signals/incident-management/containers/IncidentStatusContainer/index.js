import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectIncidentStatusContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';
import List from './components/List';
import Add from './components/Add';
import { requestStatusList, requestStatusCreate, requestStatusDismissError } from './actions';

export class IncidentStatusContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onRequestStatusList(this.props.id);
  }

  render() {
    const { incidentStatusList, changeStatusOptionList, statusList, error, loading, loadingExternal } = this.props.incidentStatusContainer;
    const state = incidentStatusList && incidentStatusList.length && incidentStatusList[incidentStatusList.length - 1].state;
    const canDisplay = typeof state !== 'number';

    return (
      <div>
        {canDisplay ?
          <div className="incident-status-container row">
            <div className="col-12">
              <Add
                id={this.props.id}
                loading={loading}
                loadingExternal={loadingExternal}
                changeStatusOptionList={changeStatusOptionList}
                statusList={statusList}
                error={error}
                onRequestStatusCreate={this.props.onRequestStatusCreate}
                incidentStatusList={incidentStatusList}
                onRequestStatusDismissError={this.props.onRequestStatusDismissError}
              />
            </div>
            <div className="col-12">
              <List incidentStatusList={incidentStatusList} />
            </div>
          </div> : ''}
      </div>
    );
  }
}

IncidentStatusContainer.propTypes = {
  id: PropTypes.string.isRequired,
  incidentStatusContainer: PropTypes.object.isRequired,

  onRequestStatusList: PropTypes.func.isRequired,
  onRequestStatusCreate: PropTypes.func.isRequired,
  onRequestStatusDismissError: PropTypes.func.isRequired
};


const mapStateToProps = createStructuredSelector({
  incidentStatusContainer: makeSelectIncidentStatusContainer(),
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestStatusList: requestStatusList,
  onRequestStatusCreate: requestStatusCreate,
  onRequestStatusDismissError: requestStatusDismissError
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentStatusContainer', reducer });
const withSaga = injectSaga({ key: 'incidentStatusContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentStatusContainer);
