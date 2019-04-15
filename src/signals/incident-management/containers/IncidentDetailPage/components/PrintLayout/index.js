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

export class PrintLayout extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onPrint = this.onPrint.bind(this);
  }

  onPrint() {
    global.window.print();
  }

  render() {
    const { incident, incidentNotesList, stadsdeelList, priorityList, onPrintView } = this.props;
    const { incidentStatusList, statusList } = this.props.incidentStatusContainer;
    return (
      <div className="print-layout row" >
        <div className="col-12">
          <h3>Melding {this.props.id}</h3>
          <div className="no-print">
            <button className="print-layout__button" onClick={this.onPrint}>Print</button>
            <button className="no-print" onClick={onPrintView}>Terug</button>
          </div>
        </div>
        <div className="print-layout__map">
          {incident.location ? <MapDetail label="" value={incident.location} /> : ''}
        </div>
        <div className="col-12 print-layout__content">
          <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} priorityList={priorityList} />
        </div>
        <div className="col-12 print-layout__content">
          {incident.image ?
            <img src={incident.image} alt={''} className="incident-detail-page__image--max-width" />
            : ''
          }
        </div>
        <div className="col-12 print-layout__content print-layout__status-list">
          <StatusList incidentStatusList={incidentStatusList} statusList={statusList} />
        </div>
        <div className="col-12 print-layout__content print-layout__status-list">
          <NotesList incidentNotesList={incidentNotesList} />
        </div>
      </div>
    );
  }
}

PrintLayout.propTypes = {
  id: PropTypes.string.isRequired,
  incident: PropTypes.object.isRequired,
  incidentNotesList: PropTypes.array.isRequired,
  stadsdeelList: PropTypes.array.isRequired,
  priorityList: PropTypes.array.isRequired,
  onPrintView: PropTypes.func.isRequired,
  incidentStatusContainer: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  incidentStatusContainer: makeSelectIncidentStatusContainer()
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
)(PrintLayout);
