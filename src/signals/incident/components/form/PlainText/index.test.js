/* eslint-disable  react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';
import 'jest-styled-components';

import * as auth from 'shared/services/auth/auth';
import configuration from 'shared/services/configuration/configuration';
import { withAppContext } from 'test/utils';

import PlainText from '.';

jest.mock('shared/services/auth/auth');
jest.mock('shared/services/configuration/configuration');

describe('Form component <PlainText />', () => {
  const MockComponent = ({ children }) => <div>{children}</div>;
  const metaProps = {
    value: 'Lorem Ipsum',
    isVisible: true,
  };

  const getProps = (meta = metaProps) => ({
    meta,
    parent: {
      meta: {
        incident: {
          id: 666,
        },
      },
    },
  });

  beforeEach(() => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);
  });

  afterEach(() => {
    jest.resetAllMocks();
    configuration.__reset();
  });

  describe('rendering', () => {
    it('should render plain text correctly', () => {
      const props = getProps({ ...metaProps, label: 'Label' });

      const { getByTestId, getByText } = render(withAppContext(<PlainText {...props} />));

      expect(getByTestId('plainText')).toBeInTheDocument();
      expect(getByText(props.meta.value)).toBeInTheDocument();
    });

    it('should render plain text with links correctly when NOT authenticated', () => {
      const linkText = 'the-link';
      const props = getProps({
        ...metaProps,
        label: 'Label',
        value: `${linkText}: <a href="/manage/incident/{incident.id}">{incident.id}</a>.`,
      });

      render(withAppContext(<PlainText {...props} />));
      expect(screen.getByText(linkText, { exact: false })).toBeInTheDocument();
      const element = screen.getByText(linkText, { exact: false }).closest('span');
      expect(element).toHaveStyleRule('cursor', 'default', { modifier: ' a' });
      expect(element).toHaveStyleRule('text-decoration', 'none', { modifier: ' a' });
      expect(element).toHaveStyleRule('color', 'inherit', { modifier: ' a' });
    });

    it('should render plain text with links correctly when authenticated', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
      const linkText = 'the-link';
      const props = getProps({
        ...metaProps,
        label: 'Label',
        value: `${linkText}: <a href="/manage/incident/{incident.id}">{incident.id}</a>.`,
      });

      render(withAppContext(<PlainText {...props} />));
      expect(screen.getByText(linkText, { exact: false })).toBeInTheDocument();
      const element = screen.getByText(linkText, { exact: false }).closest('span');
      expect(element).toHaveStyleRule('color', '#004699', { modifier: ' a' });
      expect(element).toHaveStyleRule('font-weight', 'bold', { modifier: ' a' });
    });

    it('should render plain text citation correctly', () => {
      const props = getProps({
        ...metaProps,
        type: 'citation',
      });

      const { getByTestId, getByText } = render(withAppContext(<PlainText {...props} />));

      expect(getByTestId('plainText')).toBeInTheDocument();
      expect(getByText(props.meta.value)).toBeInTheDocument();

      const element = getByTestId('plainText');
      expect(element).toHaveStyleRule('padding', '20px');
      expect(element).toHaveStyleRule('background-color', '#E6E6E6');
    });

    it('should render plain text caution correctly', () => {
      const props = getProps({
        ...metaProps,
        value: 'Caution',
        type: 'caution',
      });

      const { getByTestId, getByText } = render(withAppContext(<PlainText {...props} />));

      expect(getByTestId('plainText')).toBeInTheDocument();
      expect(getByText(props.meta.value)).toBeInTheDocument();

      const element = getByTestId('plainText');
      expect(element).toHaveStyleRule('padding-left', '12px');
      expect(element).toHaveStyleRule('border-left', '3px solid #ec0000');
    });

    it('should render plain text alert correctly', () => {
      const props = getProps({
        ...metaProps,
        type: 'alert',
      });

      const { getByTestId, getByText } = render(withAppContext(<PlainText {...props} />));

      expect(getByTestId('plainText')).toBeInTheDocument();
      expect(getByText(props.meta.value)).toBeInTheDocument();

      const element = getByTestId('plainText');
      expect(element).toHaveStyleRule('color', '#ec0000');
      expect(element).toHaveStyleRule('padding', '8px 20px');
      expect(element).toHaveStyleRule('border', '2px solid #ec0000');
    });

    it('should render plain text alert-inverted correctly', () => {
      const props = getProps({
        ...metaProps,
        type: 'alert-inverted',
      });

      const { getByTestId, getByText } = render(withAppContext(<PlainText {...props} />));

      expect(getByTestId('plainText')).toBeInTheDocument();
      expect(getByText(props.meta.value)).toBeInTheDocument();

      const element = getByTestId('plainText');
      expect(element).toHaveStyleRule('background-color', '#ec0000');
      expect(element).toHaveStyleRule('color', '#ffffff');
      expect(element).toHaveStyleRule('padding', '16px');
    });

    it('should render multiple parargraphs of text correctly', () => {
      const props = getProps({
        ...metaProps,
        value: ['Lorem Ipsum', 'jumps over', 'DOG', <MockComponent>Foo bar</MockComponent>],
        type: 'citation',
      });

      const { getByTestId, getByText } = render(withAppContext(<PlainText {...props} />));

      props.meta.value.forEach(value => {
        if (typeof value === 'string') {
          expect(getByText(value)).toBeInTheDocument();
        } else {
          expect(getByText(value.props.children)).toBeInTheDocument();
        }
      });

      const element = getByTestId('plainText');
      expect(element).toHaveStyleRule('background-color', '#E6E6E6');
      expect(element).toHaveStyleRule('padding', '20px');
    });

    it('should render markdown when fetchQuestionsFromBackend enabled', () => {
      configuration.featureFlags.fetchQuestionsFromBackend = true;
      const props = getProps({
        ...metaProps,
        value: '# Header\n[this](https://example.com) link',
      });

      const { queryByTestId, queryByText } = render(withAppContext(<PlainText {...props} />));
      expect(screen.getByRole('heading', { name: 'Header' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'this' })).toBeInTheDocument();
      expect(screen.queryByText('# Header', { exact: false })).not.toBeInTheDocument();
    });

    it('should render no plain text when not visible', () => {
      const props = getProps({
        ...metaProps,
        isVisible: false,
      });

      render(withAppContext(<PlainText {...props} />));
      expect(screen.queryByTestId('plainText')).not.toBeInTheDocument();
      expect(screen.queryByText(props.meta.value)).not.toBeInTheDocument();
    });

    it('should render no plain text without meta', () => {
      const props = getProps(null);

      render(withAppContext(<PlainText {...props} />));
      expect(screen.queryByTestId('plainText')).not.toBeInTheDocument();
    });
  });
});
