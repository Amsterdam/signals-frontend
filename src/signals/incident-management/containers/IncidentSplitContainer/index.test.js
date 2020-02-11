import React from 'react';
import { render } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { mount } from 'enzyme';

import { withAppContext } from 'test/utils';
import incident from 'utils/__tests__/fixtures/incident.json';
import { filterForSub } from 'models/categories/selectors';

import categories from 'utils/__tests__/fixtures/categories_private.json';

import IncidentSplit, { IncidentSplitContainer } from './index';
import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';

const subCategories = categories.results.filter(filterForSub);

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.mock('models/categories/selectors', () => {
  const actual = jest.requireActual('models/categories/selectors');
  // eslint-disable-next-line global-require
  const cats = require('utils/__tests__/fixtures/categories_private.json');
  const subs = cats.results.filter(actual.filterForSub);

  return {
    __esModule: true,
    ...actual,
    makeSelectSubCategories: jest.fn(() => subs),
  };
});

describe('signals/incident-management/containers/IncidentSplitContainer', () => {
  let props;

  beforeEach(() => {
    props = {
      subCategories,
      incidentModel: {
        incident,
        attachments: [],
        stadsdeelList,
        priorityList,
        loading: false,
      },
      onRequestIncident: jest.fn(),
      onRequestAttachments: jest.fn(),
      onSplitIncident: jest.fn(),
      onGoBack: jest.fn(),
    };

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      id: '42',
    }));
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<IncidentSplit />));

    const containerProps = tree.find(IncidentSplitContainer).props();

    expect(containerProps.incidentModel).toBeDefined();
    expect(containerProps.subCategories).toBeDefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<IncidentSplit />));

    const containerProps = tree.find(IncidentSplitContainer).props();

    expect(containerProps.onRequestIncident).toBeDefined();
    expect(typeof containerProps.onRequestIncident).toEqual('function');

    expect(containerProps.onRequestAttachments).toBeDefined();
    expect(typeof containerProps.onRequestAttachments).toEqual('function');

    expect(containerProps.onSplitIncident).toBeDefined();
    expect(typeof containerProps.onSplitIncident).toEqual('function');

    expect(containerProps.onGoBack).toBeDefined();
    expect(typeof containerProps.onGoBack).toEqual('function');
  });

  it('should render correctly', () => {
    const { queryByTestId, queryAllByTestId } = render(
      withAppContext(<IncidentSplitContainer {...props} />)
    );

    expect(queryByTestId('splitDetailTitle')).toHaveTextContent(
      new RegExp(`^Melding ${incident.id}$`)
    );
    expect(queryAllByTestId('incidentPartTitle')[0]).toHaveTextContent(
      /^Deelmelding 1$/
    );
    expect(queryAllByTestId('incidentPartTitle')[1]).toHaveTextContent(
      /^Deelmelding 2$/
    );

    expect(props.onRequestIncident).toHaveBeenCalledWith('42');
    expect(props.onRequestAttachments).toHaveBeenCalledWith('42');
  });
});
