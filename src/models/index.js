import loadIncidentModel from './incident';
import loadHistoryModel from './history';

const loadModels = store => {
  loadIncidentModel(store);
  loadHistoryModel(store);
};

export default loadModels;
