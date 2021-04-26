import type { InjectedStore } from 'types';
import injectReducerModel from 'utils/injectReducerModel';
import injectSagaModel from 'utils/injectSagaModel';
import reducer from './reducer';
import saga from './saga';

const loadModel = (store: InjectedStore) => {
  injectReducerModel('global', reducer, store);
  injectSagaModel('global', saga, store);
};

export default loadModel
