import React from 'react';
import { render } from '@testing-library/react';
import { ascDefaultTheme as theme } from '@datapunt/asc-ui';

import { withAppContext } from 'test/utils';
import { VARIANT_ERROR, VARIANT_SUCCESS, VARIANT_NOTICE, VARIANT_DEFAULT } from 'containers/Notification/constants';

import { SITE_HEADER_HEIGHT_TALL, SITE_HEADER_HEIGHT_SHORT } from 'containers/SiteHeader/constants';

import { CloseButton, Wrapper, Title } from '../styled';

describe('components/Notification/styled', () => {
  describe('Wrapper', () => {
    it('has the correct background colour', () => {
      const { container, rerender } = render(withAppContext(<Wrapper />));

      expect(container.firstChild).toHaveStyleRule('background-color', theme.colors.primary.main);

      rerender(withAppContext(<Wrapper variant={VARIANT_NOTICE} />));

      expect(container.firstChild).toHaveStyleRule('background-color', theme.colors.primary.main);

      rerender(withAppContext(<Wrapper variant={VARIANT_DEFAULT} />));

      expect(container.firstChild).toHaveStyleRule('background-color', theme.colors.primary.main);

      rerender(withAppContext(<Wrapper variant={VARIANT_ERROR} />));

      expect(container.firstChild).toHaveStyleRule('background-color', theme.colors.support.invalid);

      rerender(withAppContext(<Wrapper variant={VARIANT_SUCCESS} />));

      expect(container.firstChild).toHaveStyleRule('background-color', theme.colors.support.valid);
    });

    it('is positioned correctly', () => {
      const { container, rerender } = render(withAppContext(<Wrapper top={SITE_HEADER_HEIGHT_TALL} />));

      expect(container.firstChild).toHaveStyleRule('position', 'absolute');

      rerender(withAppContext(<Wrapper top={SITE_HEADER_HEIGHT_SHORT} />));

      expect(container.firstChild).toHaveStyleRule('position', 'fixed');
    });
  });

  describe('Title', () => {
    it('has a top margin', () => {
      const { container, rerender } = render(withAppContext(<Title />));

      expect(container.firstChild).toHaveStyleRule('margin', '0');

      rerender(withAppContext(<Title hasMargin />));

      expect(container.firstChild).not.toHaveStyleRule('margin', '0');
    });
  });

  describe('CloseButton', () => {
    it('is aligned vertically', () => {
      const { container, rerender } = render(withAppContext(<CloseButton />));

      expect(container.firstChild).toHaveStyleRule('align-self', 'center');

      rerender(withAppContext(<Title alignTop />));

      expect(container.firstChild).not.toHaveStyleRule('margin-top');
    });
  });
});
