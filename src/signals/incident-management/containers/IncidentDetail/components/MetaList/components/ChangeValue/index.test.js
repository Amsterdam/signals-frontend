import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import incidentJson from 'utils/__tests__/fixtures/incident.json';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import ChangeValue from './index';

jest.mock('shared/services/list-helper/list-helper');


const expectInitialState = async ({ getByTestId, queryByTestId, findByTestId }) => {
  const editButton = await findByTestId('editButton');
  const valuePath = getByTestId('valuePath');

  expect(valuePath).toBeInTheDocument();
  expect(editButton).toBeInTheDocument();
  expect(queryByTestId('changeValueForm')).not.toBeInTheDocument();
};

const expectEditState = async ({ queryByTestId, findByTestId }) => {
  const editButton = queryByTestId('editButton');
  const valuePath = queryByTestId('valuePath');

  const changeValueForm = await findByTestId('changeValueForm');

  expect(valuePath).not.toBeInTheDocument();
  expect(editButton).not.toBeInTheDocument();
  expect(changeValueForm).toBeInTheDocument();
};

describe('<ChangeValue />', () => {
  let props;

  beforeEach(() => {
    props = {
      incident: incidentJson,
      list: [
        { key: 'c', value: 'Cee' },
        { key: 'b', value: 'Bee' },
        { key: 'a', value: 'Aaaaaaaa' },
      ],
      display: 'De letter',
      path: 'incident.mockPath',
      patch: {},
      disabled: false,
      sort: false,
      type: 'mockType',
      onPatchIncident: jest.fn(),
    };

    getListValueByKey.mockImplementation(() => 'mock waarde');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', async () => {
    const renderProps = render(withAppContext(<ChangeValue {...props} />));

    await expectInitialState(renderProps);

    act(() => {
      fireEvent.click(renderProps.getByTestId('editButton'));
    });

    await expectEditState(renderProps);
  });

  it('should call onPatchIncident', async () => {
    const { getByTestId, findByTestId } = render(withAppContext(<ChangeValue {...props} />));

    const editButton = getByTestId('editButton');

    act(() => {
      fireEvent.click(editButton);
    });

    const submitBtn = await findByTestId('submitButton');

    expect(props.onPatchIncident).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(submitBtn);
    });

    expect(props.onPatchIncident).toHaveBeenCalledWith({
      id: incidentJson.id,
      type: props.type,
      patch: {
        incident: expect.any(Object),
      },
    });
  });

  it('should hide form on cancel', async () => {
    const renderProps = render(withAppContext(<ChangeValue {...props} />));

    await expectInitialState(renderProps);

    act(() => {
      fireEvent.click(renderProps.getByTestId('editButton'));
    });

    await expectEditState(renderProps);

    act(() => {
      fireEvent.click(renderProps.getByTestId('cancelButton'));
    });

    await expectInitialState(renderProps);
  });

  it('should hide form on ESC', async () => {
    const renderProps = render(withAppContext(<ChangeValue {...props} />));

    await expectInitialState(renderProps);

    act(() => {
      fireEvent.click(renderProps.getByTestId('editButton'));
    });

    await expectEditState(renderProps);

    act(() => {
      fireEvent.keyUp(document, { key: 'ArrowUp', code: 38, keyCode: 38 });
    });

    await expectEditState(renderProps);

    act(() => {
      fireEvent.keyUp(document, { key: 'Escape', code: 13, keyCode: 13 });
    });

    await expectInitialState(renderProps);

    act(() => {
      fireEvent.click(renderProps.getByTestId('editButton'));
    });

    await expectEditState(renderProps);

    act(() => {
      fireEvent.keyUp(document, { key: 'Esc', code: 13, keyCode: 13 });
    });

    await expectInitialState(renderProps);
  });
});
