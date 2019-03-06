import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import { patchIncident } from 'models/incident/actions';
import makeSelectIncidentModel from 'models/incident/selectors';

import MapInteractive from 'components/MapInteractive';
import './style.scss';

function onQueryResult(a, b) {
  console.log('onQueryResult', a, b);
}

const IncidentLocationContainer = ({ incidentModel }) => (
  <div className="incident-location-container">
    {console.log('-----------------------------------------', incidentModel.incident)}
    IncidentLocationContainer {incidentModel.incident.id}
    <MapInteractive location={incidentModel.incident.location} onQueryResult={onQueryResult} />
  </div>
);

IncidentLocationContainer.propTypes = {
  incidentModel: PropTypes.object.isRequired,
};

const mapStateToProps = () => createStructuredSelector({
  incidentModel: makeSelectIncidentModel()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onPatchIncident: patchIncident
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IncidentLocationContainer);
