// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { useContext, useMemo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import { Tag, themeSpacing } from '@amsterdam/asc-ui'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'

import {
  makeSelectMainCategories,
  makeSelectSubCategories,
} from 'models/categories/selectors'
import { dataListType, filterType } from 'shared/types'
import dataLists from 'signals/incident-management/definitions'

import {
  makeSelectDirectingDepartments,
  makeSelectRoutingDepartments,
} from 'models/departments/selectors'
import AppContext from '../../../../containers/App/context'
import IncidentManagementContext from '../../context'

const FilterWrapper = styled.div`
  margin-top: ${themeSpacing(2)};
  flex-basis: 100%;
`

const StyledTag = styled(Tag)`
  display: inline-block;
  margin: ${themeSpacing(0, 2, 2, 0)};
  white-space: nowrap;

  :first-letter {
    text-transform: capitalize;
  }
`

export const allLabelAppend = ': Alles'

export const mapKeys = (key) => {
  switch (key) {
    case 'source':
      return 'bron'

    case 'priority':
      return 'urgentie'

    case 'contact_details':
      return 'contact'

    case 'directing_department':
      return 'verantwoordelijke afdeling'

    case 'routing_department':
      return 'gekoppelde afdeling'

    case 'has_changed_children':
      return 'wijziging in deelmeldingen'

    case 'kind':
      return 'soort'

    default:
      return key
  }
}

const renderItem = (display, key) => (
  <StyledTag
    colorType="tint"
    colorSubtype="level3"
    key={key}
    data-testid="filterTagListTag"
  >
    {display}
  </StyledTag>
)

const renderGroup = (tag, main, list, tagKey) => {
  if (tag.length === list.length) {
    return renderItem(`${mapKeys(tagKey)}${allLabelAppend}`, tagKey)
  }

  return tag.map((item) => renderTag(item.key, main, list))
}

const renderTag = (key, mainCategories, list) => {
  let found = false

  if (list) {
    found = list.find((i) => i.key === key || i.slug === key)
  }

  let display = (found && found.value) || key
  if (!display) {
    return null
  }

  const foundMain = mainCategories.find((i) => i.key === key)

  display += foundMain ? allLabelAppend : ''
  // eslint-disable-next-line consistent-return
  return renderItem(display, key)
}

export const FilterTagListComponent = (props) => {
  const {
    tags,
    mainCategories,
    subCategories,
    directingDepartments,
    routingDepartments,
  } = props
  const { sources } = useContext(AppContext)
  const { districts } = useContext(IncidentManagementContext)

  const map = {
    ...dataLists,
    area: districts,
    maincategory_slug: mainCategories,
    category_slug: subCategories,
    source: sources,
    directing_department: directingDepartments,
    routing_department: routingDepartments,
  }

  const tagsList = { ...tags }

  // piece together date strings into one tag
  const dateRange = useMemo(() => {
    if (!tagsList.created_after && !tagsList.created_before) return undefined

    return [
      'Datum:',
      tagsList.created_after &&
        format(parseISO(tagsList.created_after), 'dd-MM-yyyy'),
      't/m',
      (tagsList.created_before &&
        format(parseISO(tagsList.created_before), 'dd-MM-yyyy')) ||
        'nu',
    ]
      .filter(Boolean)
      .join(' ')
  }, [tagsList.created_after, tagsList.created_before])

  if (dateRange) {
    delete tagsList.created_after
    delete tagsList.created_before

    tagsList.dateRange = dateRange
  }

  return mainCategories && subCategories ? (
    <FilterWrapper>
      {Object.entries(tagsList).map(([tagKey, tag]) =>
        Array.isArray(tag)
          ? renderGroup(tag, mainCategories, map[tagKey], tagKey)
          : renderTag(tag, mainCategories, map[tagKey])
      )}
    </FilterWrapper>
  ) : null
}

FilterTagListComponent.propTypes = {
  tags: filterType,
  mainCategories: dataListType,
  subCategories: dataListType,
  directingDepartments: dataListType,
  routingDepartments: dataListType,
}

FilterTagListComponent.defaultProps = {
  tags: {},
}

const mapStateToProps = createStructuredSelector({
  mainCategories: makeSelectMainCategories,
  subCategories: makeSelectSubCategories,
  directingDepartments: makeSelectDirectingDepartments,
  routingDepartments: makeSelectRoutingDepartments,
})

const withConnect = connect(mapStateToProps)

export default withConnect(FilterTagListComponent)
