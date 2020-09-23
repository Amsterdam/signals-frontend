/* eslint-disable  react/prop-types */
import React from 'react';
import * as auth from 'shared/services/auth/auth';

import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import PlainText from '.';

jest.mock('shared/services/auth/auth');

describe('Form component <PlainText />', () => {
  jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);
  const MockComponent = ({ children }) => <div>{children}</div>;
  const incidentContainer = {
    incident: {
      id: 666,
    },
  };

  describe('rendering', () => {
    it('should render plain text correctly', () => {
      const props = {
        meta: {
          value: 'Lorem Ipsum',
          isVisible: true,
        },
        parent: {
          meta: {
            incidentContainer,
          },
        },
      };

      const { getByTestId, getByText } = render(withAppContext(<PlainText {...props} />));

      expect(getByTestId('plainText')).toBeInTheDocument();
      expect(getByText(props.meta.value)).toBeInTheDocument();
    });

    it('should render plain text citation correctly', () => {
      const props = {
        meta: {
          value: 'Lorem Ipsum',
          type: 'citation',
          isVisible: true,
        },
        parent: {
          meta: {
            incidentContainer,
          },
        },
      };

      const { container, getByTestId, getByText } = render(withAppContext(<PlainText {...props} />));

      expect(getByTestId('plainText')).toBeInTheDocument();
      expect(getByText(props.meta.value)).toBeInTheDocument();
      expect(container.querySelector(`.${props.meta.type}`)).toBeInTheDocument();
    });

    it('should render plain text caution correctly', () => {
      const props = {
        meta: {
          value: 'Caution',
          type: 'caution',
          isVisible: true,
        },
        parent: {
          meta: {
            incidentContainer,
          },
        },
      };

      const { container, getByTestId, getByText } = render(withAppContext(<PlainText {...props} />));

      expect(getByTestId('plainText')).toBeInTheDocument();
      expect(getByText(props.meta.value)).toBeInTheDocument();
      expect(container.querySelector(`.${props.meta.type}`)).toBeInTheDocument();
    });

    it('should render multiple parargraphs of text correctly', () => {
      const props = {
        meta: {
          value: ['Lorem Ipsum', 'jumps over', 'DOG', <MockComponent>Foo bar</MockComponent>],
          type: 'citation',
          isVisible: true,
        },
        parent: {
          meta: {
            incidentContainer,
          },
        },
      };

      const { container, getByText } = render(withAppContext(<PlainText {...props} />));

      props.meta.value.forEach(value => {
        if (typeof value === 'string') {
          expect(getByText(value)).toBeInTheDocument();
        }
        else {
          expect(getByText(value.props.children)).toBeInTheDocument();
        }
      });
      expect(container.querySelector(`.${props.meta.type}`)).toBeInTheDocument();
    });

    it('should render no plain text when not visible', () => {
      const props = {
        meta: {
          value: 'Lorem Ipsum',
          isVisible: false,
        },
      };

      const { queryByTestId, queryByText } = render(withAppContext(<PlainText {...props} />));
      expect(queryByTestId('plainText')).not.toBeInTheDocument();
      expect(queryByText(props.meta.value)).not.toBeInTheDocument();
    });
  });
});
