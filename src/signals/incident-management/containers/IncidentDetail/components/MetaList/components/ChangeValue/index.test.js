import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import incidentJson from 'utils/__tests__/fixtures/incident.json';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import ChangeValue from '.';

jest.mock('shared/services/list-helper/list-helper');


const expectInitialState = async ({ queryByTestId, findByTestId }) => {
  const editButton = await findByTestId('editMockTypeButton');

  expect(editButton).toBeInTheDocument();
  expect(queryByTestId('changeValueForm')).not.toBeInTheDocument();
};

const expectEditState = async ({ queryByTestId, findByTestId }) => {
  const editButton = queryByTestId('editMockTypeButton');

  const changeValueForm = await findByTestId('changeValueForm');

  expect(editButton).not.toBeInTheDocument();
  expect(changeValueForm).toBeInTheDocument();
};

describe('<ChangeValue />', () => {
  let props = {
    type: 'mockType',
  };

  // data-testid attributes are generated dynamically
  const editTestId = `edit${props.type.charAt(0).toUpperCase()}${props.type.slice(1)}Button`;
  const submitTestId = `submit${props.type.charAt(0).toUpperCase()}${props.type.slice(1)}Button`;
  const cancelTestId = `cancel${props.type.charAt(0).toUpperCase()}${props.type.slice(1)}Button`;

  beforeEach(() => {
    props = {
      incident: {
        ...incidentJson,
        someValue: 'c',
      },
      list: [
        { key: 'c', value: 'Cee', description: 'Foo bar baz' },
        { key: 'b', value: 'Bee' },
        { key: 'a', value: 'Aaaaaaaa', description: 'Zork' },
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
      fireEvent.click(renderProps.getByTestId(editTestId));
    });

    await expectEditState(renderProps);
  });

  it('should call onPatchIncident', async () => {
    const { getByTestId, findByTestId } = render(withAppContext(<ChangeValue {...props} />));

    const editButton = getByTestId(editTestId);

    act(() => {
      fireEvent.click(editButton);
    });

    const submitBtn = await findByTestId(submitTestId);

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
      fireEvent.click(renderProps.getByTestId(editTestId));
    });

    await expectEditState(renderProps);

    act(() => {
      fireEvent.click(renderProps.getByTestId(cancelTestId));
    });

    await expectInitialState(renderProps);
  });

  it('should hide form on ESC', async () => {
    const renderProps = render(withAppContext(<ChangeValue {...props} />));

    await expectInitialState(renderProps);

    act(() => {
      fireEvent.click(renderProps.getByTestId(editTestId));
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
      fireEvent.click(renderProps.getByTestId(editTestId));
    });

    await expectEditState(renderProps);

    act(() => {
      fireEvent.keyUp(document, { key: 'Esc', code: 13, keyCode: 13 });
    });

    await expectInitialState(renderProps);
  });

  it('should render info text', async () => {
    const renderProps = render(withAppContext(<ChangeValue {...props} infoKey="description" />));

    await expectInitialState(renderProps);

    act(() => {
      fireEvent.click(renderProps.getByTestId(editTestId));
    });

    expect(renderProps.queryByTestId('infoText')).not.toBeInTheDocument();

    renderProps.unmount();

    renderProps.rerender(withAppContext(<ChangeValue {...props} infoKey="description" valuePath="someValue" />));

    await expectInitialState(renderProps);

    act(() => {
      fireEvent.click(renderProps.getByTestId(editTestId));
    });

    expect(renderProps.queryByTestId('infoText')).toBeInTheDocument();
    expect(renderProps.queryByTestId('infoText').textContent).toEqual('Foo bar baz');

    act(() => {
      fireEvent.change(document.querySelector('select'), { target: { value: 'a' } });
    });

    expect(renderProps.queryByTestId('infoText').textContent).toEqual('Zork');
  });
});
