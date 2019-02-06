import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import { requestIncident } from 'models/incident/actions';
import makeSelectIncidentModel from 'models/incident/selectors';

import reducer from './reducer';
import saga from './saga';
import './style.scss';

import SplitDetail from './components/SplitDetail';

export class IncidentSplitContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onRequestIncident(this.props.id);
  }

  render() {
    const { incident, loading, stadsdeelList } = this.props.incidentModel;
    return (
      <div className="incident-split-container">
        {loading ? <LoadingIndicator /> :
        (
          <div className="row">
            <div className="col-8">
              IncidentSplitContainer
            </div>
            <div className="col-4">
              <SplitDetail incident={incident} stadsdeelList={stadsdeelList} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

IncidentSplitContainer.propTypes = {
  id: PropTypes.string.isRequired,
  incidentModel: PropTypes.object,
  onRequestIncident: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  incidentModel: makeSelectIncidentModel()
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
