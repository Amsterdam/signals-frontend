// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { render } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import type { FormOptions } from 'types/reactive-form'

import FileInputRenderer from './'
import type { Props } from './FileInputRenderer'
import { FileTypes } from '../types/FileInput'

const defaultProps: Props = {
  handler: () => ({ value: [] as File[] }),
  getError: jest.fn(),
  hasError: jest.fn(),
  parent: {
    meta: {} as Props['parent']['meta'],
  },
  meta: {
    label: "Foto's toevoegen",
    subtitle: 'Voeg een foto toe om de situatie te verduidelijken',
    minFileSize: 30720,
    maxFileSize: 20971520,
    allowedFileTypes: Object.values(FileTypes),
    maxNumberOfFiles: 3,
    name: 'images',
    isVisible: true,
  },
  validatorsOrOpts: {} as FormOptions,
}

describe('Form component <FileInputRenderer />', () => {
  it('should render upload field correctly', () => {
    const { queryByTestId } = render(
      withAppContext(<FileInputRenderer {...defaultProps} />)
    )

    expect(queryByTestId('file-input')).toBeInTheDocument()
  })

  it('should render no upload field when not visible', () => {
    const { queryByTestId } = render(
      withAppContext(
        <FileInputRenderer
          {...defaultProps}
          meta={{
            ...defaultProps.meta,
            isVisible: false,
          }}
        />
      )
    )

    expect(queryByTestId('file-input')).not.toBeInTheDocument()
  })
})
