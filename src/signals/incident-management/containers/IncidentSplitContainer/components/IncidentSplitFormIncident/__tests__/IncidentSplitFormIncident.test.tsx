// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'

import { withAppContext } from 'test/utils'
import { subcategoriesGroupedByCategories as subcategories } from 'utils/__tests__/fixtures'

import IncidentSplitFormIncident from '..'
import parentIncidentFixture from '../../../__tests__/parentIncidentFixture.json'

const withFormContext = (component: any) => {
  const Wrapper = ({ children }: { children?: ReactNode }) => {
    const methods = useForm()
    return <FormProvider {...methods}>{children}</FormProvider>
  }

  return withAppContext(<Wrapper>{component}</Wrapper>)
}

describe('IncidentSplitFormIncident', () => {
  const props = {
    parentIncident: parentIncidentFixture,
    subcategories,
  }

  it('renders correctly', () => {
    render(withFormContext(<IncidentSplitFormIncident {...props} />))

    expect(
      screen.queryAllByTestId('incident-split-form-incident-title')[0]
    ).toHaveTextContent(/^Deelmelding 1$/)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByTestId('add-note')).toBeInTheDocument()
  })

  it('should split incidents until limit is reached then it should hide incident split button', () => {
    global.window.HTMLElement.prototype.scrollIntoView = jest.fn()
    render(withFormContext(<IncidentSplitFormIncident {...props} />))

    expect(screen.getAllByRole('textbox')).toHaveLength(1)

    const button = screen.getByTestId(
      'incident-split-form-incident-split-button'
    )

    for (let index = 1; index < 10; index = index + 1) {
      userEvent.click(button)

      const splittedIncidentCount = index + 1
      if (splittedIncidentCount < 10)
        expect(
          screen.getByTestId('incident-split-form-incident-split-button')
        ).toBeInTheDocument()
      expect(screen.getAllByRole('textbox')).toHaveLength(splittedIncidentCount)
    }

    expect(
      screen.queryByTestId('incident-split-form-incident-split-button')
    ).not.toBeInTheDocument()

    expect(
      screen.queryAllByTestId('incident-split-form-incident-title')[9]
    ).toHaveTextContent(/^Deelmelding 10$/)

    // eslint-disable-next-line
    // @ts-ignore
    delete global.window.HTMLElement.prototype.scrollIntoView
  })

  it('renders SelectLoader when subcategories are not yet loaded', () => {
    const { rerender } = render(
      withFormContext(
        <IncidentSplitFormIncident {...props} subcategories={[[], []]} />
      )
    )

    expect(screen.getByTestId('select-loader')).toBeInTheDocument()
    expect(screen.queryByTestId('subcategory-22')).not.toBeInTheDocument()

    rerender(withFormContext(<IncidentSplitFormIncident {...props} />))

    expect(screen.queryByTestId('select-loader')).not.toBeInTheDocument()
    expect(screen.getByTestId('subcategory-22')).toBeInTheDocument()
  })

  it('should render incident split form when parent already has split incidents', () => {
    const parentIncidentWithChildCount = {
      ...parentIncidentFixture,
      childrenCount: 3,
    }
    render(
      withFormContext(
        <IncidentSplitFormIncident
          {...props}
          parentIncident={parentIncidentWithChildCount}
        />
      )
    )

    expect(
      screen.getAllByRole('heading', { name: /^Deelmelding \d+$/ })
    ).toHaveLength(1)
    expect(
      screen.getByRole('heading', { name: 'Deelmelding 4' })
    ).toBeInTheDocument()
  })

  it('should be able to remove a sub incident when there are more then one', () => {
    render(withFormContext(<IncidentSplitFormIncident {...props} />))

    expect(
      screen.queryByRole('button', { name: 'Verwijder deelmelding' })
    ).not.toBeInTheDocument()

    userEvent.click(
      screen.getByRole('button', { name: 'Extra deelmelding toevoegen' })
    )

    const removeBtns = screen.getAllByRole('button', {
      name: 'Verwijder deelmelding',
    })

    expect(removeBtns).toHaveLength(2)

    userEvent.click(removeBtns[1])

    expect(
      screen.queryByRole('button', { name: 'Verwijder deelmelding' })
    ).not.toBeInTheDocument()
  })
})
