import loadIncidentModel from './incident';
import loadHistoryModel from './history';
import loadSearchModel from './search';
import loadRolesModel from './roles';

const loadModels = store => {
  loadIncidentModel(store);
  loadHistoryModel(store);
  loadSearchModel(store);
  loadRolesModel(store);
};

export default loadModels;
