import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import 'jest-styled-components';

import Label from '..';

describe('signals/incident-management/components/Label', () => {
  it('should render a label element', () => {
    const { container, getByLabelText } = render(
      withAppContext(
        <div>
          <Label htmlFor="someOtherElementId">This is my label text</Label>
          <input type="text" id="someOtherElementId" />
        </div>,
      ),
    );

    expect(container.querySelectorAll('label')).toHaveLength(1);
    expect(getByLabelText('This is my label text')).toBeTruthy();
  });

  it('should not require the htmlFor prop when the element is not rendered as a label', () => {
    global.console.error = jest.fn();

    const { container, rerender } = render(
      withAppContext(
        <div>
          <Label>This is my label text</Label>
          <input type="text" id="someOtherElementId" />
        </div>,
      ),
    );

    expect(global.console.error).toHaveBeenCalled();

    global.console.error.mockReset();

    rerender(
      withAppContext(
        <div>
          <Label as="span">This is my label text</Label>
          <input type="text" id="someOtherElementId" />
        </div>,
      ),
    );

    expect(global.console.error).not.toHaveBeenCalled();
    expect(container.querySelectorAll('span')).toHaveLength(1);

    global.console.error.mockRestore();
  });

  it('should show the correct color', () => {
    const { container, rerender } = render(
      withAppContext(
        <div>
          <Label htmlFor="someOtherElementId" isGroupHeader>This is my label text</Label>
          <input type="text" id="someOtherElementId" />
        </div>,
      ),
    );

    expect(container.querySelector('label')).not.toHaveStyleRule('color', 'inherit');

    rerender(
      withAppContext(
        <div>
          <Label htmlFor="someOtherElementId" isGroupHeader={false}>This is my label text</Label>
          <input type="text" id="someOtherElementId" />
        </div>,
      ),
    );

    expect(container.querySelector('label')).toHaveStyleRule('color', 'inherit');
  });
});
