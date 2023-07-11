// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import * as reactRouterDom from 'react-router-dom'

import * as categoriesSelectors from 'models/categories/selectors'

import { Subcategories } from './Subcategories'
import { withAppContext } from '../../../../../../test/utils'
jest.spyOn(global, 'setTimeout')

jest.mock('react-router-dom', () => {
  return {
    __esModule: true,
    ...jest.requireActual('react-router-dom'),
  }
})

jest.mock('models/categories/selectors', () => {
  const structuredCategorie = require('utils/__tests__/fixtures/categories_structured.json')
  return {
    __esModule: true,
    ...jest.requireActual('models/categories/selectors'),
    makeSelectStructuredCategories: () => structuredCategorie,
  }
})

describe('SubCategories', () => {
  const onChangeMock = jest.fn()
  const navigateMock = jest.fn()

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest
      .spyOn(reactRouterDom, 'useNavigate')
      .mockImplementation(() => navigateMock)

    navigateMock.mockRestore()
    onChangeMock.mockRestore()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Subcategories with data', () => {
    it('should render the SelectedSubcategories with checkbox 1 and 2 selected', () => {
      render(
        withAppContext(
          <Subcategories onChange={onChangeMock} value={[131, 132]} />
        )
      )

      act(() => {
        jest.runAllTimers()
      })

      expect(screen.queryAllByRole('checkbox')[0]).toBeChecked()
      expect(screen.queryAllByRole('checkbox')[1]).toBeChecked()
    })

    it('click the first two checkboxes, cancel the selections, and then navigate back', async () => {
      render(
        withAppContext(<Subcategories onChange={onChangeMock} value={[]} />)
      )

      userEvent.click(screen.queryAllByRole('checkbox')[0])
      userEvent.click(screen.queryAllByRole('checkbox')[1])

      act(() => {
        jest.runAllTimers()
      })

      const cancelButton = screen.getByTestId('cancel-btn')
      await waitFor(() => {
        cancelButton.click()
      })

      expect(onChangeMock).not.toBeCalled()
      expect(navigateMock).toBeCalledWith('../')
    })

    it('click the first two checkboxes, save the selections, and then navigate back', async () => {
      render(
        withAppContext(<Subcategories onChange={onChangeMock} value={[]} />)
      )

      userEvent.click(screen.queryAllByRole('checkbox')[0])
      userEvent.click(screen.queryAllByRole('checkbox')[1])

      act(() => {
        jest.runAllTimers()
      })

      userEvent.click(screen.getByTestId('submit-btn'))

      expect(onChangeMock).toBeCalledWith([131, 132])
      expect(navigateMock).toBeCalledWith('../')
    })

    it('click the "Alles selecteren", save the selections, and then navigate back', async () => {
      render(
        withAppContext(<Subcategories onChange={onChangeMock} value={[]} />)
      )

      userEvent.click(screen.getAllByText('Alles selecteren')[0])

      act(() => {
        jest.runAllTimers()
      })

      userEvent.click(screen.getByTestId('submit-btn'))

      expect(onChangeMock).toBeCalledWith([131])
      expect(navigateMock).toBeCalledWith('../')
    })

    it('should select all and deselect all checkboxes', async () => {
      render(
        withAppContext(<Subcategories onChange={onChangeMock} value={[]} />)
      )

      userEvent.click(screen.getAllByText('Alles selecteren')[0])

      act(() => {
        jest.runAllTimers()
      })

      expect(screen.queryAllByRole('checkbox')[0]).toBeChecked()

      userEvent.click(screen.getAllByText('Niets selecteren')[0])

      act(() => {
        jest.runAllTimers()
      })

      expect(screen.queryAllByRole('checkbox')[0]).not.toBeChecked()
    })

    it('should go back when clicking backlink', () => {
      render(
        withAppContext(<Subcategories onChange={onChangeMock} value={[]} />)
      )

      act(() => {
        jest.runAllTimers()
      })

      expect(
        screen.getByText('Terug naar standaardtekst').parentNode
      ).not.toHaveFocus()

      userEvent.click(screen.getByText('Terug naar standaardtekst'))

      expect(
        screen.getByText('Terug naar standaardtekst').parentNode
      ).toHaveFocus()
    })
  })

  describe('Subcategories without data', () => {
    it('should not render, nor call onChange when there are no subcategories', () => {
      jest
        .spyOn(categoriesSelectors, 'makeSelectStructuredCategories')
        .mockImplementation(() => null)

      render(
        withAppContext(<Subcategories onChange={onChangeMock} value={[]} />)
      )

      act(() => {
        jest.runAllTimers()
      })

      expect(screen.queryAllByRole('checkbox').length).toBe(0)

      expect(screen.queryAllByRole('Opslaan')).toEqual([])
    })
  })
})
