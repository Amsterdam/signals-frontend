import loadIncidentModel from './incident';
import loadNotesModel from './notes';
import loadHistoryModel from './history';


const loadModels = (store) => {
  loadIncidentModel(store);
  loadNotesModel(store);
  loadHistoryModel(store);
};

export default loadModels;
