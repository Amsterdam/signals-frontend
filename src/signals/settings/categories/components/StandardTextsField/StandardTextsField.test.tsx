// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

import { StandardTextsField } from './StandardTextsField'
import { fetchMock } from '../../../../../../internals/testing/msw-server'
import { withAppContext } from '../../../../../test/utils'

fetchMock.disableMocks()

describe('StandardTextsField', () => {
  it('should render', async () => {
    act(() => {
      render(
        withAppContext(<StandardTextsField name="test" onChange={() => {}} />)
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Titel #1')).toBeInTheDocument()
    })
  })

  it('should move text and call onChange', async () => {
    const onchangeMock = jest.fn()

    act(() => {
      render(
        withAppContext(
          <StandardTextsField name="test" onChange={onchangeMock} />
        )
      )
    })

    await waitFor(() => {
      userEvent.click(screen.getAllByTestId('up-button')[0])
      userEvent.click(screen.getAllByTestId('up-button')[0])
    })

    await waitFor(() => {
      expect(onchangeMock).toHaveBeenCalledTimes(0)
    })
    userEvent.click(screen.getAllByTestId('down-button')[0])

    await waitFor(() => {
      expect(onchangeMock).toHaveBeenCalledTimes(1)
    })
    userEvent.click(screen.getAllByTestId('up-button')[1])

    await waitFor(() => {
      expect(onchangeMock).toHaveBeenCalledTimes(2)
    })
  })

  it('should add text and call onChange', async () => {
    act(() => {
      render(
        withAppContext(<StandardTextsField name="test" onChange={() => {}} />)
      )
    })

    await waitFor(() => {
      const selectElement = screen.getByTestId('standardTexts')
      userEvent.click(screen.getByTestId('standardTexts'))
      const options = screen.getAllByRole('option')
      const lastOption = options[options.length - 1]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userEvent.selectOptions(selectElement, lastOption.value)
      expect(selectElement).toHaveValue('Doorgezet naar extern')
      expect(
        screen.getByText('In afwachting van behandeling')
      ).toBeInTheDocument()
    })

    await waitFor(() => {})
  })
})
