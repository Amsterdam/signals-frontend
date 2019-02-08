import loadIncidentModel from './incident';
import loadNotesModel from './notes';

const loadModels = (store) => {
  loadIncidentModel(store);
  loadNotesModel(store);
};

export default loadModels;
