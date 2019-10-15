import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import SplitNotificationBar from './index';

describe('<SplitNotificationBar />', () => {
  let props;

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('success', () => {
    beforeEach(() => {
      props = {
        data: {
          id: '42',
          created: {
            children: [
              { id: 43 },
              { id: 44 }
            ]
          }
        },
        onDismissSplitNotification: jest.fn()
      };
    });

    it('should render 2  items correctly', () => {
      const { queryByTestId } = render(
        withAppContext(<SplitNotificationBar {...props} />)
      );

      expect(queryByTestId('splitNotificationBar')).toHaveTextContent(/^Melding 42 is gesplitst in 43 en 44$/);
    });

    it('should render 3 items correctly', () => {
      props.data.created.children.push({ id: 45 });
      const { queryByTestId } = render(
        withAppContext(<SplitNotificationBar {...props} />)
      );

      expect(queryByTestId('splitNotificationBar')).toHaveTextContent(/^Melding 42 is gesplitst in 43, 44 en 45$/);
    });

    it('should render no items correctly', () => {
      props.data.created = undefined;
      const { queryByTestId } = render(
        withAppContext(<SplitNotificationBar {...props} />)
      );

      expect(queryByTestId('splitNotificationBar')).toHaveTextContent(/^$/);
    });

    it('should dissmiss bar when clicked', () => {
      const { queryByTestId } = render(
        withAppContext(<SplitNotificationBar {...props} />)
      );
      fireEvent.click(queryByTestId('splitNotificationBarCloseButton'));

      expect(props.onDismissSplitNotification).toHaveBeenCalledTimes(1);
    });
  });

  describe('error', () => {
    beforeEach(() => {
      props = {
        data: {
          response: {
            status: 503
          }
        },
        onDismissSplitNotification: jest.fn()
      };
    });

    it('should render general error correctly', () => {
      const { queryByTestId } = render(
        withAppContext(<SplitNotificationBar {...props} />)
      );

      expect(queryByTestId('splitNotificationBar')).toHaveTextContent(/^De melding is helaas niet gesplitst\. Er is een onbekende fout ontstaan\.$/);
    });

    it('should render general 403 correctly', () => {
      props.data.response.status = 403;
      const { queryByTestId } = render(
        withAppContext(<SplitNotificationBar {...props} />)
      );

      expect(queryByTestId('splitNotificationBar')).toHaveTextContent(/^De melding is helaas niet gesplitst\. U bent niet bevoegd om deze melding te splitsen\.$/);
    });

    it('should render general 412 correctly', () => {
      props.data.response.status = 412;
      const { queryByTestId } = render(
        withAppContext(<SplitNotificationBar {...props} />)
      );

      expect(queryByTestId('splitNotificationBar')).toHaveTextContent(/^De melding is helaas niet gesplitst\. U kunt geen meldingen splitsen die al gesplitst zijn\.$/);
    });

    it('should dissmiss bar when clicked', () => {
      const { queryByTestId } = render(
        withAppContext(<SplitNotificationBar {...props} />)
      );
      fireEvent.click(queryByTestId('splitNotificationBarCloseButton'));

      expect(props.onDismissSplitNotification).toHaveBeenCalledTimes(1);
    });
  });
});
