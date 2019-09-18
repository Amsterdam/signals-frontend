import injectReducerModel from 'utils/injectReducerModel';
import injectSagaModel from 'utils/injectSagaModel';

import reducer from './reducer';
import saga from './saga';

const loadModel = (store) => {
  injectReducerModel('search', reducer, store);
  injectSagaModel('search', saga, store);
};

export default loadModel;
