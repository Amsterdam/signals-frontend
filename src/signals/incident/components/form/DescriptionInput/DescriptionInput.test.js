// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import DescriptionInput from '.'

const metaFields = {
  name: 'input-field-name',
  isVisible: true,
}

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
}

describe('signals/incident/components/form/DescriptionInput', () => {
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
      )

      expect(getByTestId('description-input')).toBeInTheDocument()
      expect(getByTestId('description-info')).toBeInTheDocument()
    })

    it('should render with a character counter with value correctly', () => {
      const description = 'the-description'
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
      )

      expect(getByTestId('description-info')).toBeInTheDocument()
      expect(getByTestId('description-info').textContent).toEqual(
        `${description.length}/100 tekens`
      )
    })
  })

  describe('events', () => {
    const value = 'diabolo'

    afterEach(() => {
      jest.resetAllMocks()
    })

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
      )

      const element = getByTestId('description-input')

      userEvent.type(element, value)
      fireEvent.blur(element)

      await findByTestId('description-input')

      expect(props.parent.meta.getClassification).toHaveBeenCalledWith(
        'diabolo'
      )
      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo',
      })
    })

    it("doesn't call the predictions for empty values", async () => {
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
      )

      const element = getByTestId('description-input')

      userEvent.clear(element)
      fireEvent.blur(element)

      await findByTestId('description-input')

      expect(props.parent.meta.getClassification).not.toHaveBeenCalled()
      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': '',
      })
    })

    it("doesn't call the predictions when they are disabled", async () => {
      const parent = {
        ...props.parent,
        meta: {
          ...props.parent.meta,
          incidentContainer: { usePredictions: false },
        },
      }

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
      )

      const element = getByTestId('description-input')

      userEvent.type(element, value)
      fireEvent.blur(element)

      await findByTestId('description-input')

      expect(parent.meta.getClassification).not.toHaveBeenCalled()
      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo',
      })
    })
  })
})
