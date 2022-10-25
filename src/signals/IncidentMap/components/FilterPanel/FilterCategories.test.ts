/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import {mockFilters} from "../__test__"
import {render} from "@testing-library/react"
import {Props} from "./FilterCategoryWithSub"

const mockOnToggleCategory= jest.fn()
const defaultProps: Props ={
  onToggleCategory: mockOnToggleCategory,
  filters: mockFilters
}

describe('FilterCategories', () =>{
  it('renders the FilterCategories component', ()=> {
    render(<FilterCategoryWithSub {...defaultProps}/>)
    screen.debug()
    expect(screen.getByText('Afval')).toBeInTheDocument()
  })

})
