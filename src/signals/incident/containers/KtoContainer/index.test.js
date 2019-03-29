import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import { getContext } from 'test/utils';
import { KtoContainer, mapDispatchToProps } from './index';
import { REQUEST_KTA_ANSWERS, CHECK_KTO, STORE_KTO, UPDATE_KTA } from './constants';

jest.mock('./components/KtoForm', () => () => 'KtoForm');

describe('<KtoContainer />', () => {
  let props;
  let state;
  let context;

  beforeEach(() => {
    props = {
      uuid: '42-abc',
      yesNo: '',
      ktoContainer: { form: {} },

      requestKtaAnswers: jest.fn(),
      checkKto: jest.fn(),
      onUpdateKto: jest.fn(),
      onStoreKto: jest.fn()
    };

    state = fromJS({
      global: {},
      ktoContainer: {
        form: {}
      }
    });
    context = getContext(state);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render yes header correctly', () => {
      props.yesNo = 'ja';
      const wrapper = shallow(<KtoContainer {...props} />, { context });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no header correctly', () => {
      props.yesNo = 'nee';
      const wrapper = shallow(<KtoContainer {...props} />, { context });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render finished header correctly', () => {
      props.yesNo = 'finished';
      props.ktoContainer.ktoFinished = true;
      const wrapper = shallow(<KtoContainer {...props} />, { context });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render empty header correctly', () => {
      const wrapper = shallow(<KtoContainer {...props} />, { context });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render too late error header correctly', () => {
      props.ktoContainer.statusError = 'too late';
      const wrapper = shallow(<KtoContainer {...props} />, { context });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render filled out error header correctly', () => {
      props.ktoContainer.statusError = 'filled out';
      const wrapper = shallow(<KtoContainer {...props} />, { context });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should get answers', () => {
      mapDispatchToProps(dispatch).requestKtaAnswers('nee');
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_KTA_ANSWERS, payload: 'nee' });
    });

    it('should update kto', () => {
      mapDispatchToProps(dispatch).onUpdateKto({ text: 'foo' });
      expect(dispatch).toHaveBeenCalledWith({ type: UPDATE_KTA, payload: { text: 'foo' } });
    });

    it('should check kto', () => {
      mapDispatchToProps(dispatch).checkKto({ text: 'bar' });
      expect(dispatch).toHaveBeenCalledWith({ type: CHECK_KTO, payload: { text: 'bar' } });
    });

    it('should store kto', () => {
      mapDispatchToProps(dispatch).onStoreKto({ text: 'baz' });
      expect(dispatch).toHaveBeenCalledWith({ type: STORE_KTO, payload: { text: 'baz' } });
    });
  });
});
