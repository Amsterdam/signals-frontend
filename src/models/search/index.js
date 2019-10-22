import injectReducerModel from 'utils/injectReducerModel';

import reducer from './reducer';

const loadModel = store => {
  injectReducerModel('search', reducer, store);
};

export default loadModel;
