// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, act, fireEvent } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import CheckboxInput from '../CheckboxInput'

describe('Form component <CheckboxInput />', () => {
  describe('rendering', () => {
    it('should render a checkbox', () => {
      const props = {
        meta: {
          name: 'input-field-name',
          value: 'Ja, dat is goed',
          isVisible: true,
        },
        handler: () => ({
          value: {
            value: true,
            label: 'Ja dat wil ik',
          },
        }),
      }

      const { container } = render(withAppContext(<CheckboxInput {...props} />))

      const checkbox = container.querySelector('input[type="checkbox"]')

      expect(checkbox).toBeInTheDocument()
      expect(checkbox.name).toEqual(props.meta.name)
    })

    it('should render multiple checkbox', () => {
      const props = {
        meta: {
          name: 'input-field-name',
          values: { red: 'Rood', blue: 'Blauw', green: 'Groen' },
          isVisible: true,
        },
        handler: () => ({
          value: ['blue'],
        }),
      }

      const { container } = render(withAppContext(<CheckboxInput {...props} />))

      const checkboxes = container.querySelectorAll('input[type="checkbox"]')

      expect(checkboxes).toHaveLength(Object.keys(props.meta.values).length)

      checkboxes.forEach((element, index) => {
        const key = Object.keys(props.meta.values)[index]

        expect(element.name).toEqual(`${props.meta.name}-${key}1`)
        expect(Object.keys(props.meta.values).includes(element.value)).toBe(
          true
        )

        if (element.value === props.handler().value) {
          expect(element.checked).toBe(true)
        } else {
          expect(element.checked).toBe(false)
        }
      })
    })

    it('should render multi checkbox without value correctly', () => {
      const props = {
        meta: {
          name: 'input-field-name',
          values: { red: 'Rood', blue: 'Blauw', green: 'Groen' },
          isVisible: true,
        },
        handler: () => ({
          value: undefined,
        }),
      }

      const { container } = render(withAppContext(<CheckboxInput {...props} />))

      const checkboxes = container.querySelectorAll('input[type="checkbox"]')

      checkboxes.forEach((element) => {
        expect(element.checked).toBe(false)
      })
    })

    it('should not render checkboxes', () => {
      const props = {
        meta: {
          name: 'input-field-name',
          isVisible: false,
        },
        handler: () => ({
          value: {
            value: true,
            label: 'Ja dat wil ik',
          },
        }),
      }

      const { container } = render(withAppContext(<CheckboxInput {...props} />))

      const checkboxes = container.querySelectorAll('input[type="checkbox"]')

      expect(checkboxes).toHaveLength(0)
    })
  })

  describe('events', () => {
    it('can be checked and unchecked with default values', () => {
      const updateIncident = jest.fn()
      const props = {
        meta: {
          name: 'input-field-name',
          value: 'Ja, dat is goed',
          isVisible: true,
        },
        parent: {
          meta: {
            updateIncident,
          },
        },
        handler: () => ({
          value: {
            value: true,
            label: 'Ja dat wil ik',
          },
        }),
      }

      const { container } = render(withAppContext(<CheckboxInput {...props} />))

      const checkbox = container.querySelector('input[type="checkbox"]')

      expect(updateIncident).not.toHaveBeenCalled()

      act(() => {
        fireEvent.click(checkbox)
      })

      expect(updateIncident).toHaveBeenCalledWith({
        [props.meta.name]: {
          value: !props.handler().value,
          label: props.meta.value,
        },
      })
    })

    it('can be checked and unchecked with multiple values', () => {
      const updateIncident = jest.fn()
      const props = {
        meta: {
          name: 'input-field-name',
          values: { red: 'Rood', blue: 'Blauw', green: 'Groen' },
          isVisible: true,
        },
        parent: {
          meta: {
            updateIncident,
          },
        },
        handler: () => ({
          value: [{ id: 'blue', label: 'Blauw' }],
        }),
      }

      const { container } = render(withAppContext(<CheckboxInput {...props} />))

      expect(container.querySelectorAll('[checked]')).toHaveLength(1)

      const unchecked = container.querySelector(
        'input[type="checkbox"]:not([checked])'
      )

      expect(updateIncident).not.toHaveBeenCalled()

      act(() => {
        fireEvent.click(unchecked)
      })

      expect(updateIncident).toHaveBeenCalledWith({
        [props.meta.name]: [
          { id: 'blue', label: 'Blauw' },
          { id: 'red', label: 'Rood' },
        ],
      })

      act(() => {
        fireEvent.click(unchecked)
      })

      expect(updateIncident).toHaveBeenCalledWith({
        [props.meta.name]: [{ id: 'blue', label: 'Blauw' }],
      })
    })
  })
})
