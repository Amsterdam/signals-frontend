import getInjectorsReducer from 'utils/reducerInjectors';
import getInjectorsSagas from 'utils/sagaInjectors';

import reducer from './reducer';
import saga from './saga';

const loadModel = (store) => {
  getInjectorsReducer(store).injectReducer('incidentModel', reducer);
  getInjectorsSagas(store).injectSaga('incidentModel', { mode: undefined, saga });
};

export default loadModel;

