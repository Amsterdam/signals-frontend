import React from 'react';
import { render } from '@testing-library/react';
import 'jest-styled-components';

import { withAppContext } from 'test/utils';
import {
  VARIANT_ERROR,
  VARIANT_SUCCESS,
  VARIANT_NOTICE,
  VARIANT_DEFAULT,
} from 'containers/Notification/constants';

import {
  SITE_HEADER_HEIGHT_TALL,
  SITE_HEADER_HEIGHT_SHORT,
} from 'containers/SiteHeader/constants';

import {
  CloseButton,
  Wrapper,
  Title,
  BG_COLOR_NOTICE,
  BG_COLOR_ERROR,
  BG_COLOR_SUCCESS,
} from '../styled';

describe('components/Notification/styled', () => {
  describe('Wrapper', () => {
    it('has the correct background colour', () => {
      const { container, rerender } = render(withAppContext(<Wrapper />));

      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        BG_COLOR_NOTICE
      );

      rerender(withAppContext(<Wrapper variant={VARIANT_NOTICE} />));

      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        BG_COLOR_NOTICE
      );

      rerender(withAppContext(<Wrapper variant={VARIANT_DEFAULT} />));

      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        BG_COLOR_NOTICE
      );

      rerender(withAppContext(<Wrapper variant={VARIANT_ERROR} />));

      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        BG_COLOR_ERROR
      );

      rerender(withAppContext(<Wrapper variant={VARIANT_SUCCESS} />));

      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        BG_COLOR_SUCCESS
      );
    });

    it('is positioned correctly', () => {
      const { container, rerender } = render(
        withAppContext(<Wrapper top={SITE_HEADER_HEIGHT_TALL} />)
      );

      expect(container.firstChild).toHaveStyleRule('position', 'absolute');

      rerender(
        withAppContext(<Wrapper top={SITE_HEADER_HEIGHT_SHORT} />)
      );

      expect(container.firstChild).toHaveStyleRule('position', 'fixed');
    });
  });

  describe('Title', () => {
    it('has a top margin', () => {
      const { container, rerender } = render(
        withAppContext(<Title />)
      );

      expect(container.firstChild).toHaveStyleRule('margin', '0');

      rerender(
        withAppContext(<Title hasMargin />)
      );

      expect(container.firstChild).not.toHaveStyleRule('margin', '0');
    });
  });

  describe('CloseButton', () => {
    it('is aligned vertically', () => {
      const { container, rerender } = render(
        withAppContext(<CloseButton />)
      );

      expect(container.firstChild).toHaveStyleRule('align-self', 'center');

      rerender(
        withAppContext(<Title alignTop />)
      );

      expect(container.firstChild).not.toHaveStyleRule('margin-top');
    });
  });
});
