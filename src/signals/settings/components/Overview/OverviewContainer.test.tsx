import { render, waitFor } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import OverviewContainer from 'signals/settings/components/Overview/OverviewContainer'

import { withAppContext } from '../../../../test/utils'

describe('settings/components/Overview/OverviewContainer', () => {
  it('should render login button', async () => {
    const dispatch = jest.fn()

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(dispatch)

    render(withAppContext(<OverviewContainer />))

    await waitFor(() => {
      expect(dispatch).toBeCalled()
    })
  })
})
