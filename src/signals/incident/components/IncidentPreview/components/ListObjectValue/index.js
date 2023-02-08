// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { List, ListItem } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledList = styled(List)`
  margin-bottom: 0;
`

const ListObjectValue = ({ value }) => {
  if (!(Array.isArray(value) && value.length > 0)) return null

  return (
    <StyledList>
      {value
        .filter(({ label }) => Boolean(label))
        .map((item) => (
          <ListItem key={item.label}>{item.label}</ListItem>
        ))}
    </StyledList>
  )
}

ListObjectValue.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default ListObjectValue
