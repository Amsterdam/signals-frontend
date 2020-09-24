import injectReducerModel from 'utils/injectReducerModel';
import injectSagaModel from 'utils/injectSagaModel';
import reducer from './reducer';
import saga from './saga';

const loadModel = store => {
  injectReducerModel('global', reducer, store);
  injectSagaModel('global', saga, store);
};

export default loadModel;
