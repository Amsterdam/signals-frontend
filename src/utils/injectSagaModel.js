import getInjectorsSagas from 'utils/sagaInjectors';

const injectSagaModel = (key, saga, store) => {
  getInjectorsSagas(store).injectSaga(key, { saga });
};

export default injectSagaModel;
