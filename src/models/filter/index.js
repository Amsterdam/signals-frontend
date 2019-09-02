import injectReducerModel from 'utils/injectReducerModel';
import injectSagaModel from 'utils/injectSagaModel';

import reducer from './reducer';
import saga from './saga';

const loadModel = (store) => {
  injectReducerModel('filterModel', reducer, store);
  injectSagaModel('filterModel', saga, store);
};

export default loadModel;
