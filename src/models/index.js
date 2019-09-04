import loadIncidentModel from './incident';
import loadHistoryModel from './history';
import loadSearchModel from './search';

const loadModels = (store) => {
  loadIncidentModel(store);
  loadHistoryModel(store);
  loadSearchModel(store);
};

export default loadModels;
