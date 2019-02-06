import getInjectorsReducer from 'utils/reducerInjectors';
import getInjectorsSagas from 'utils/sagaInjectors';

import reducer from './reducer';
import saga from './saga';

const loadModel = (store) => {
  getInjectorsReducer(store).injectReducer('incident', reducer);
  getInjectorsSagas(store).injectSaga('incident', { mode: undefined, saga });
};

export default loadModel;

