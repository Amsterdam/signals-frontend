import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import 'jest-styled-components';
import {
  themeColor,
} from '@datapunt/asc-ui';
import FormAlert from '..';

describe('src/components/FormAlert', () => {
  const title = 'Here be dragons';
  const message =
    'Means dangerous or unexplored territories, in imitation of the medieval practice of putting dragons, sea serpents and other mythological creatures in uncharted areas of maps.';

  it('should render a title', () => {
    const { getByText } = render(withAppContext(<FormAlert title={title} />));

    expect(getByText(title)).toBeInTheDocument();
  });

  it('should render a message', () => {
    const { getByText } = render(
      withAppContext(<FormAlert title={title} message={message} />)
    );

    expect(getByText(message)).toBeInTheDocument();
  });

  it('should have correct styling', () => {
    const { container, rerender } = render(
      withAppContext(
        <FormAlert title={title} />
      )
    );

    expect(container.querySelector('h4')).toHaveStyleRule('margin-bottom: 0');

    rerender(
      withAppContext(
        <FormAlert title={title} message={message} />
      )
    );

    expect(container.querySelector('h4')).not.toHaveStyleRule('margin-bottom: 0');

    rerender(
      withAppContext(
        <FormAlert title={title} />
      )
    );

    expect(container.querySelector('h4')).not.toHaveStyleRule(`color: ${themeColor('secondary')}`);
    expect(container.querySelector('div')).not.toHaveStyleRule(`border-color: ${themeColor('secondary')}`);

    rerender(
      withAppContext(
        <FormAlert title={title} isNotification />
      )
    );

    expect(container.querySelector('h4')).toHaveStyleRule(`color: ${themeColor('secondary')}`);
    expect(container.querySelector('div')).toHaveStyleRule(`border-color: ${themeColor('secondary')}`);
  });
});
