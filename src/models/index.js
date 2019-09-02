import loadIncidentModel from './incident';
import loadHistoryModel from './history';
import loadFilterModel from './filter';

const loadModels = (store) => {
  loadIncidentModel(store);
  loadHistoryModel(store);
  loadFilterModel(store);
};

export default loadModels;
