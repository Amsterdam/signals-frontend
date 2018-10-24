import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectIncidentHistoryContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';
import List from './components/List';
import { requestHistoryList } from './actions';

export class IncidentHistoryContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onRequestHistoryList(this.props.id);
  }

  render() {
    const { incidentHistoryList } = this.props.incidentHistoryContainer;

    return (
      <div>
        <div className="incident-history-container row">
          <div className="col-12">
            <List incidentHistoryList={incidentHistoryList} />
          </div>
        </div>
      </div>
    );
  }
}

IncidentHistoryContainer.propTypes = {
  id: PropTypes.string.isRequired,
  incidentHistoryContainer: PropTypes.object.isRequired,

  onRequestHistoryList: PropTypes.func.isRequired
};


const mapStateToProps = createStructuredSelector({
  incidentHistoryContainer: makeSelectIncidentHistoryContainer(),
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestHistoryList: requestHistoryList
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentHistoryContainer', reducer });
const withSaga = injectSaga({ key: 'incidentHistoryContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentHistoryContainer);
