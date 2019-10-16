import injectReducerModel from 'utils/injectReducerModel';
import injectSagaModel from 'utils/injectSagaModel';

import reducer from './reducer';
import saga from './saga';

const loadModel = store => {
  injectReducerModel('incidentModel', reducer, store);
  injectSagaModel('incidentModel', saga, store);
};

export default loadModel;
