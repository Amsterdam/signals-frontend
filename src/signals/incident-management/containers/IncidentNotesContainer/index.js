import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectNotesModel from 'models/notes/selectors';
import makeSelectIncidentNotesContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';
import List from './components/List';
import Add from './components/Add';
import { requestNoteCreate } from './actions';

export class IncidentNotesContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { incidentNotesContainer: { error, loading, loadingExternal } } = this.props;
    const { incidentNotesList } = this.props.notesModel;

    return (
      <div>
        <div className="incident-notes-container row">
          <div className="col-12">
            <Add
              id={this.props.id}
              loading={loading}
              loadingExternal={loadingExternal}
              error={error}
              onRequestNoteCreate={this.props.onRequestNoteCreate}
            />
          </div>
          <div className="col-12">
            <List incidentNotesList={incidentNotesList} />
          </div>
        </div>
      </div>
    );
  }
}

IncidentNotesContainer.defaultProps = {
  incidentNotesList: []
};

IncidentNotesContainer.propTypes = {
  id: PropTypes.string.isRequired,
  incidentNotesContainer: PropTypes.object.isRequired,
  notesModel: PropTypes.object,

  onRequestNoteCreate: PropTypes.func.isRequired
};


const mapStateToProps = createStructuredSelector({
  incidentNotesContainer: makeSelectIncidentNotesContainer(),
  notesModel: makeSelectNotesModel()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestNoteCreate: requestNoteCreate,
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentNotesContainer', reducer });
const withSaga = injectSaga({ key: 'incidentNotesContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentNotesContainer);
