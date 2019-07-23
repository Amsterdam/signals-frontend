import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import Modal from '../';

describe('components/Modal', () => {
  afterEach(cleanup);

  it('should not render', () => {
    const { container } = render(
      withAppContext(<Modal isOpen={false} />),
    );

    expect(container.firstChild).toBeNull();
  });

  it('should have a heading', () => {
    const { container } = render(
      withAppContext(<Modal isOpen />),
    );

    expect(container.querySelectorAll('h2')).toHaveLength(1);
  });

  it('should call onClose', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      withAppContext(<Modal isOpen onClose={onClose} />),
    );

    fireEvent(
      getByTestId('closeBtn'),
      new MouseEvent('click', { bubbles: true }),
    );

    expect(onClose).toHaveBeenCalled();
  });

  it('should have confirmation buttons', () => {
    const { queryByTestId } = render(
      withAppContext(<Modal isOpen />),
    );

    expect(queryByTestId('resetBtn')).not.toBeNull();
    expect(queryByTestId('cancelBtn')).not.toBeNull();
    expect(queryByTestId('submitBtn')).not.toBeNull();
  });

  it('should call onReset', () => {
    const onReset = jest.fn();
    const { getByTestId } = render(
      withAppContext(<Modal isOpen onReset={onReset} />),
    );

    fireEvent(
      getByTestId('resetBtn'),
      new MouseEvent('click', { bubbles: true }),
    );

    expect(onReset).toHaveBeenCalled();
  });

  it('should call onCancel', () => {
    const onCancel = jest.fn();
    const { getByTestId } = render(
      withAppContext(<Modal isOpen onCancel={onCancel} />),
    );

    fireEvent(
      getByTestId('cancelBtn'),
      new MouseEvent('click', { bubbles: true }),
    );

    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onSubmit', () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(
      withAppContext(<Modal isOpen onSubmit={onSubmit} />),
    );

    fireEvent(
      getByTestId('submitBtn'),
      new MouseEvent('click', { bubbles: true }),
    );

    expect(onSubmit).toHaveBeenCalled();
  });
});
