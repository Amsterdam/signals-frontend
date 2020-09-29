import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import DescriptionInput from '.';

describe('signals/incident/components/form/DescriptionInput', () => {
  const metaFields = {
    name: 'input-field-name',
    isVisible: true,
  };

  const props = {
    handler: jest.fn(),
    parent: {
      meta: {
        updateIncident: jest.fn(),
        getClassification: jest.fn(),
        incidentContainer: { usePredictions: true },
      },
      value: jest.fn(),
      controls: {
        'input-field-name': {
          updateValueAndValidity: jest.fn(),
        },
      },
    },
  };

  describe('rendering', () => {
    it('should render correctly', () => {
      const { getByTestId } = render(
        withAppContext(
          <DescriptionInput
            {...props}
            meta={{
              ...metaFields,
              maxLength: 100,
            }}
          />
        )
      );

      expect(getByTestId('descriptionInput')).toBeInTheDocument();
      expect(getByTestId('descriptionInfo')).toBeInTheDocument();
    });

    it('should render with a character counter with value correctly', () => {
      const description = 'the-description';
      const { getByTestId } = render(
        withAppContext(
          <DescriptionInput
            {...props}
            meta={{
              ...metaFields,
              maxLength: 100,
            }}
            value={description}
          />
        )
      );

      expect(getByTestId('descriptionInfo')).toBeInTheDocument();
      expect(getByTestId('descriptionInfo').textContent).toEqual(`${description.length}/100 tekens`);
    });
  });

  describe('events', () => {
    const event = { target: { value: 'diabolo' } };

    beforeEach(() => {
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('sets incident when value changes', async () => {
      const { getByTestId, findByTestId } = render(
        withAppContext(
          <DescriptionInput
            {...props}
            meta={{
              ...metaFields,
              maxLength: 100,
            }}
          />
        )
      );

      const element = getByTestId('descriptionInput');
      element.focus();
      act(() => {
        fireEvent.change(element, event);
        element.blur();
      });

      await findByTestId('descriptionInput');
      expect(props.parent.meta.getClassification).toHaveBeenCalledWith('diabolo');
      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo',
      });
    });

    it('doesn\'t call the predictions for empty values', async () => {
      const { getByTestId, findByTestId } = render(
        withAppContext(
          <DescriptionInput
            {...props}
            meta={{
              ...metaFields,
              maxLength: 100,
            }}
            value="the-value"
          />
        )
      );

      const element = getByTestId('descriptionInput');
      element.focus();
      act(() => {
        fireEvent.change(element, { target: { value: '' } });
        element.blur();
      });

      await findByTestId('descriptionInput');

      expect(props.parent.meta.getClassification).not.toHaveBeenCalled();
      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': '',
      });
    });

    it('doesn\'t call the predictions when they are disabled', async () => {
      const parent = {
        ...props.parent,
        meta: {
          ...props.parent.meta,
          incidentContainer: { usePredictions: false },
        },
      };

      const { getByTestId, findByTestId } = render(
        withAppContext(
          <DescriptionInput
            {...props}
            meta={{
              ...metaFields,
              maxLength: 100,
            }}
            parent={parent}
          />
        )
      );

      const element = getByTestId('descriptionInput');
      element.focus();
      act(() => {
        fireEvent.change(element, event);
        element.blur();
      });

      await findByTestId('descriptionInput');

      expect(parent.meta.getClassification).not.toHaveBeenCalled();
      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo',
      });
    });
  });
});
