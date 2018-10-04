import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectIncidentPriorityContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';
import Add from './components/Add';
import { requestPriorityUpdate } from './actions';


export class IncidentPriorityContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { priorityList, loading } = this.props.incidentPriorityContainer;
    return (
      <div className="col-6">
        <div className="incident-edit-container">
          <Add
            id={this.props.id}
            priorityList={priorityList}
            loading={loading}
            onRequestPriorityUpdate={this.props.onRequestPriorityUpdate}
          />
        </div>
      </div>
    );
  }
}

IncidentPriorityContainer.propTypes = {
  id: PropTypes.string.isRequired,
  incidentPriorityContainer: PropTypes.object.isRequired,

  onRequestPriorityUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  incidentPriorityContainer: makeSelectIncidentPriorityContainer(),
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestPriorityUpdate: requestPriorityUpdate,
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentPriorityContainer', reducer });
const withSaga = injectSaga({ key: 'incidentPriorityContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentPriorityContainer);
