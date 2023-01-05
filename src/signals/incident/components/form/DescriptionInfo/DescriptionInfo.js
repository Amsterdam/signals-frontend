// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { breakpoint } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { makeSelectSubCategories } from 'models/categories/selectors'
import { makeSelectIncidentContainer } from 'signals/incident/containers/IncidentContainer/selectors'

const DescriptionInfoWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;

  @media screen and ${breakpoint('max-width', 'laptopM')} {
    flex-direction: column;
  }

  & > :first-child {
    flex-grow: 1;
    white-space: nowrap;
  }
`

const DescriptionInfo = ({ info }) => {
  const subcategories = useSelector(makeSelectSubCategories)
  const { classificationPrediction } = useSelector(makeSelectIncidentContainer)
  const [suggestion, setSuggestion] = useState()

  useEffect(() => {
    if (!subcategories) return
    setSuggestion(
      subcategories.find(
        (s) => s.is_active && s.slug === classificationPrediction?.slug
      )
    )
  }, [subcategories, classificationPrediction])

  return (
    <DescriptionInfoWrapper data-testid="description-info">
      <div>{info}</div>
      {suggestion && <div>{`Subcategorie voorstel: ${suggestion.name}`}</div>}
    </DescriptionInfoWrapper>
  )
}

DescriptionInfo.propTypes = {
  info: PropTypes.string.isRequired,
}

export default DescriptionInfo
