import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import KTOContainer, { headerStrings, KtoContainerComponent, mapDispatchToProps } from '.';
import {
  REQUEST_KTO_ANSWERS, CHECK_KTO, STORE_KTO, UPDATE_KTO,
} from './constants';

jest.mock('./components/KtoForm', () => () => 'KtoForm');

describe('<KtoContainer />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<KTOContainer />));

    const containerProps = tree
      .find(KtoContainerComponent)
      .props();

    expect(containerProps.ktoContainer).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<KTOContainer />));

    const containerProps = tree
      .find(KtoContainerComponent)
      .props();

    expect(containerProps.onUpdateKto).not.toBeUndefined();
    expect(typeof containerProps.onUpdateKto).toEqual('function');

    expect(containerProps.onStoreKto).not.toBeUndefined();
    expect(typeof containerProps.onStoreKto).toEqual('function');

    expect(containerProps.requestKtoAnswersAction).not.toBeUndefined();
    expect(typeof containerProps.requestKtoAnswersAction).toEqual('function');

    expect(containerProps.requestKtoAnswersAction).not.toBeUndefined();
    expect(typeof containerProps.requestKtoAnswersAction).toEqual('function');
  });

  describe('rendering', () => {
    const containerProps = {
      ktoContainer: {
        ktoFinished: false,
      },
      onUpdateKto: jest.fn(),
      onStoreKto: jest.fn(),
      requestKtoAnswersAction: jest.fn(),
      checkKtoAction: jest.fn(),
      match: {
        params: {
          yesNo: 'ja',
          uuid: '70923ee6-338b-c991-e74a-718cb243cc83',
        },
      },
    };

    it('should render yes header correctly', () => {
      const { queryByText } = render(withAppContext(<KtoContainerComponent {...containerProps} />));

      expect(queryByText(headerStrings.ja)).not.toBeNull();
    });

    it('should render no header correctly', () => {
      containerProps.match.params.yesNo = 'nee';
      const { queryByText } = render(withAppContext(<KtoContainerComponent {...containerProps} />));

      expect(queryByText(headerStrings.nee)).not.toBeNull();
    });

    it('should render finished header correctly', () => {
      containerProps.match.params.yesNo = 'finished';
      const { queryByText } = render(withAppContext(<KtoContainerComponent {...containerProps} />));

      expect(queryByText(headerStrings.finished)).not.toBeNull();

      containerProps.ktoContainer.ktoFinished = false;
    });

    it('should render empty header correctly', () => {
      containerProps.ktoContainer.ktoFinished = true;
      const { queryByText } = render(withAppContext(<KtoContainerComponent {...containerProps} />));

      expect(queryByText(headerStrings.finished)).not.toBeNull();
    });

    it('should render too late error header correctly', () => {
      containerProps.ktoContainer.statusError = 'too late';
      const { queryByText } = render(withAppContext(<KtoContainerComponent {...containerProps} />));

      expect(queryByText(headerStrings.tooLate)).not.toBeNull();
    });

    it('should render filled out error header correctly', () => {
      containerProps.ktoContainer.statusError = 'filled out';
      const { queryByText } = render(withAppContext(<KtoContainerComponent {...containerProps} />));

      expect(queryByText(headerStrings.filledOut)).not.toBeNull();
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should get answers', () => {
      mapDispatchToProps(dispatch).requestKtoAnswersAction('nee');
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_KTO_ANSWERS, payload: 'nee' });
    });

    it('should update kto', () => {
      mapDispatchToProps(dispatch).onUpdateKto({ text: 'foo' });
      expect(dispatch).toHaveBeenCalledWith({ type: UPDATE_KTO, payload: { text: 'foo' } });
    });

    it('should check kto', () => {
      mapDispatchToProps(dispatch).checkKtoAction({ text: 'bar' });
      expect(dispatch).toHaveBeenCalledWith({ type: CHECK_KTO, payload: { text: 'bar' } });
    });

    it('should store kto', () => {
      mapDispatchToProps(dispatch).onStoreKto({ text: 'baz' });
      expect(dispatch).toHaveBeenCalledWith({ type: STORE_KTO, payload: { text: 'baz' } });
    });
  });
});
