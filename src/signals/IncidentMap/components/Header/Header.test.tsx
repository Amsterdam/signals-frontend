// /* SPDX-License-Identifier: MPL-2.0 */
// /* Copyright (C) 2022 Gemeente Amsterdam */
import { screen, render } from '@testing-library/react'

import { Header } from './Header'

// const resizeWindow = (x, y) => {
//     window.innerWidth = x;
//     window.innerHeight = y;
//     window.dispatchEvent(new Event('resize'));
//   }

// jest.mock('@amsterdam/asc-ui', () => ({
//   __esModule: true,
//   ...jest.requireActual('@amsterdam/asc-ui'),
//   Hidden: () => (
//     <div>
//       <MenuItems />
//     </div>
//   ),
// }))

describe('Header', () => {
  it('should render heading correctly', () => {
    render(<Header />)
    // expect(screen.getByText('Meldingenkaart')).toBeInTheDocument()
    // expect(screen.queryByText('Doe een melding')).toBeInTheDocument()
  })

  it('should render burger menu correctly', () => {})
})
