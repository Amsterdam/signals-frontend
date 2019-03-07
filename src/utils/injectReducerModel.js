import getInjectorsReducer from 'utils/reducerInjectors';

const injectReducerModel = (key, reducer, store) => {
  getInjectorsReducer(store).injectReducer(key, reducer);
};

export default injectReducerModel;
