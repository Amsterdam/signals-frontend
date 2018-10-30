import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import './style.scss';
import MapDetail from '../MapDetail';
import IncidentDetail from '../IncidentDetail';
import StatusList from '../../../IncidentStatusContainer/components/List';
import NotesList from '../../../IncidentNotesContainer/components/List';
import makeSelectIncidentStatusContainer from '../../../IncidentStatusContainer/selectors';
import makeSelectIncidentNotesContainer from '../../../IncidentNotesContainer/selectors';

export class PrintLayout extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onPrint = this.onPrint.bind(this);
  }

  onPrint() {
    global.window.print();
  }

  render() {
    const { incident, stadsdeelList, priorityList, onPrintView } = this.props;
    const { incidentStatusList, statusList } = this.props.incidentStatusContainer;
    const { incidentNotesList } = this.props.incidentNotesContainer;
    return (
      <div className="print-layout row container" >
        <div className="col-12">
          <h3>Melding {this.props.id}</h3>
          <div className="no-print">
            <button className="print-layout__button" onClick={this.onPrint}>Print</button>
            <button className="no-print" onClick={onPrintView}>Terug</button>
          </div>
        </div>
        <div className="col-12">
          {incident.location ? <MapDetail label="" value={incident.location} /> : ''}
        </div>
        <div className="col-12">
          <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
        </div>
        <div className="col-12">
          {incident.image ?
            <img src={incident.image} alt={''} className="incident-detail-page__image--max-width" />
            : ''
          }
        </div>
        <div className="col-12 print-layout__status-list">
          <StatusList incidentStatusList={incidentStatusList} statusList={statusList} />
        </div>
        <div className="col-12 print-layout__status-list">
          <NotesList incidentNotesList={incidentNotesList} statusList={statusList} />
        </div>
      </div>
    );
  }
}

PrintLayout.propTypes = {
  id: PropTypes.string.isRequired,
  incident: PropTypes.object.isRequired,
  stadsdeelList: PropTypes.array.isRequired,
  priorityList: PropTypes.array.isRequired,
  onPrintView: PropTypes.func.isRequired,
  incidentStatusContainer: PropTypes.object.isRequired,
  incidentNotesContainer: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  incidentStatusContainer: makeSelectIncidentStatusContainer(),
  incidentNotesContainer: makeSelectIncidentNotesContainer()
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect
)(PrintLayout);
