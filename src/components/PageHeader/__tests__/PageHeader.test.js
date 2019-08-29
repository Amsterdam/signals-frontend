import React from 'react';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

import PageHeader from '../';

jest.mock('scroll-lock');

describe('components/PageHeader', () => {
  afterEach(cleanup);

  it('renders required elements', () => {
    const { getByText } = render(
      withAppContext(
        <PageHeader title="I am a title">
          <span>I am a child</span>
        </PageHeader>,
      ),
    );

    // title
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(getByText('I am a title').tagName).toEqual('H1');

    // children
    expect(document.querySelectorAll('span')).toHaveLength(1);

    // filter button
    expect(getByText('Filteren').tagName).toEqual('BUTTON');
  });

  it('renders a subtitle', () => {
    const subTitle = 'And me is subtitle';
    const { getByText } = render(
      withAppContext(
        <PageHeader title="I am a title" subTitle={subTitle}>
          <span>I am a child</span>
        </PageHeader>,
      ),
    );

    expect(getByText(subTitle)).toBeTruthy();
  });

  it('opens modal', () => {
    const { queryByTestId, getByTestId } = render(
      withAppContext(
        <PageHeader title="I am a title">
          <span>I am a child</span>
        </PageHeader>,
      ),
    );

    expect(queryByTestId('modal')).toBeNull();

    fireEvent(
      getByTestId('modalBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(queryByTestId('modal')).not.toBeNull();
  });

  it('closes modal on ESC', () => {
    const { queryByTestId, getByTestId } = render(
      withAppContext(
        <PageHeader title="I am a title">
          <span>I am a child</span>
        </PageHeader>,
      ),
    );

    fireEvent(
      getByTestId('modalBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(queryByTestId('modal')).not.toBeNull();

    fireEvent.keyDown(global.document, { key: 'Esc', keyCode: 27 });

    expect(queryByTestId('modal')).toBeNull();
  });

  it('closes modal by means of close button', () => {
    const { queryByTestId, getByTestId } = render(
      withAppContext(
        <PageHeader title="I am a title">
          <span>I am a child</span>
        </PageHeader>,
      ),
    );

    fireEvent(
      getByTestId('modalBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(queryByTestId('modal')).not.toBeNull();

    fireEvent(
      getByTestId('closeBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(queryByTestId('modal')).toBeNull();
  });

  it('should disable page scroll', () => {
    const { getByTestId } = render(
      withAppContext(
        <PageHeader title="I am a title">
          <span>I am a child</span>
        </PageHeader>,
      ),
    );

    fireEvent(
      getByTestId('modalBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(disablePageScroll).toHaveBeenCalled();
  });

  it('should enable page scroll', () => {
    const { getByTestId } = render(
      withAppContext(
        <PageHeader title="I am a title">
          <span>I am a child</span>
        </PageHeader>,
      ),
    );

    fireEvent(
      getByTestId('modalBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    fireEvent(
      getByTestId('closeBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(enablePageScroll).toHaveBeenCalled();
  });
});
