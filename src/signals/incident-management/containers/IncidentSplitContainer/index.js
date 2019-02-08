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

import { splitIncident } from './actions';

import reducer from './reducer';
import saga from './saga';
import './style.scss';

import SplitDetail from './components/SplitDetail';
import SplitForm from './components/SplitForm';

export class IncidentSplitContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    this.props.onRequestIncident(this.props.id);
  }

  handleSubmit() {
    console.log('handleSubmit');
    this.props.onSplitIncident(this.props.id);
  }

  handleCancel() {
    console.log('handleCancel');
  }

  render() {
    const { incident, loading, stadsdeelList } = this.props.incidentModel;
    return (
      <div className="incident-split-container">
        {loading ? <LoadingIndicator /> :
        (
          <div className="row">
            <div className="col-8">
              <SplitForm
                incident={incident}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
              />
            </div>
            <div className="col-4">
              <SplitDetail
                incident={incident}
                stadsdeelList={stadsdeelList}
              />
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
  onSplitIncident: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  incidentModel: makeSelectIncidentModel()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncident: requestIncident,
  onSplitIncident: splitIncident
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentSplitContainer', reducer });
const withSaga = injectSaga({ key: 'incidentSplitContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentSplitContainer);
