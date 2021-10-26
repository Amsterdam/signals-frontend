// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fireEvent, render, screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'

import type { ReactNode } from 'react'

import { withAppContext } from 'test/utils'

import { subcategoriesGroupedByCategories as subcategories } from 'utils/__tests__/fixtures'
import parentIncidentFixture from '../../../__tests__/parentIncidentFixture.json'

import IncidentSplitFormIncident from '..'

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
      screen.queryAllByTestId('incidentSplitFormIncidentTitle')[0]
    ).toHaveTextContent(/^Deelmelding 1$/)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByTestId('addNote')).toBeInTheDocument()
  })

  it('renders a note field', () => {
    render(withFormContext(<IncidentSplitFormIncident {...props} />))
  })

  it('should split incidents until limit is reached then it should hide incident split button', () => {
    global.window.HTMLElement.prototype.scrollIntoView = jest.fn()
    render(withFormContext(<IncidentSplitFormIncident {...props} />))

    expect(screen.getAllByRole('textbox')).toHaveLength(1)

    const button = screen.getByTestId('incidentSplitFormIncidentSplitButton')

    new Array(9).forEach((_, index) => {
      fireEvent.click(button)

      const splittedIncidentCount = index + 2
      if (splittedIncidentCount < 10)
        expect(
          screen.getByTestId('incidentSplitFormIncidentSplitButton')
        ).toBeInTheDocument()
      expect(screen.getAllByRole('textbox')).toHaveLength(splittedIncidentCount)
    })

    expect(
      screen.queryByTestId('incidentSplitFormIncidentSplitButton')
    ).not.toBeInTheDocument()

    expect(
      screen.queryAllByTestId('incidentSplitFormIncidentTitle')[9]
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

    expect(screen.getByTestId('selectLoader')).toBeInTheDocument()
    expect(screen.queryByTestId('subcategory-1')).not.toBeInTheDocument()

    rerender(withFormContext(<IncidentSplitFormIncident {...props} />))

    expect(screen.queryByTestId('selectLoader')).not.toBeInTheDocument()
    expect(screen.getByTestId('subcategory-1')).toBeInTheDocument()
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
})
