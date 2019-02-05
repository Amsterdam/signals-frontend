import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { requestIncident } from './actions';
import makeSelectIncidentSplitContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';


export class IncidentSplitContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onRequestIncident(this.props.id);
  }

  render() {
    return (
      <div className="incident-split-container">
        IncidentSplitContainer
      </div>
    );
  }
}

IncidentSplitContainer.propTypes = {
  id: PropTypes.string.isRequired,
  onRequestIncident: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  incidentSplitContainer: makeSelectIncidentSplitContainer()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncident: requestIncident
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentSplitContainer', reducer });
const withSaga = injectSaga({ key: 'incidentSplitContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentSplitContainer);
