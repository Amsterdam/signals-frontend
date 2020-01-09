import loadIncidentModel from './incident';
import loadHistoryModel from './history';
import loadSearchModel from './search';
import loadRolesModel from './roles';
import loadDepartmentsModel from './departments';

const loadModels = store => {
  loadIncidentModel(store);
  loadHistoryModel(store);
  loadSearchModel(store);
  loadRolesModel(store);
  loadDepartmentsModel(store);
};

export default loadModels;
