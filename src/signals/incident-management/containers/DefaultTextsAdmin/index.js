// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { compose, bindActionCreators } from 'redux'
import { Heading, Row, Column, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { dataListType, defaultTextsType } from 'shared/types'
import { makeSelectSubCategories } from 'models/categories/selectors'
import LoadingIndicator from 'components/LoadingIndicator'

import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'

import FormFooter from 'components/FormFooter'
import { useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { reCategory } from '../../../../shared/services/resolveClassification'
import { statusList } from '../../definitions'
import HiddenInput from '../../components/HiddenInput'
import SelectForm from './components/SelectForm'
import DefaultTextsForm from './components/DefaultTextsForm'

import {
  fetchDefaultTexts,
  storeDefaultTexts,
  orderDefaultTexts,
} from './actions'
import makeSelectDefaultTextsAdmin from './selectors'
import reducer from './reducer'
import saga from './saga'

const StyledH1 = styled(Heading)`
  margin-bottom: ${themeSpacing(8)};
  margin-top: ${themeSpacing(6)};
`

const StyledFormFooter = styled(FormFooter)`
  position: fixed;
`

const StyledWrapper = styled.div`
  margin-top: 33px;
  flex-basis: 100%;
`

const DEFAULT_TEXT_FIELDS = 20

const fields = [...new Array(DEFAULT_TEXT_FIELDS).keys()].reduce(
  (acc, key) => ({
    ...acc,
    [`item${key}`]: {
      title: [''],
      text: [''],
      is_active: [false],
    },
  }),
  {}
)

export const DefaultTextsAdminContainer = ({
  subCategories,
  onFetchDefaultTexts,
  onSubmitTexts,
  onOrderDefaultTexts,
  defaultTextsAdmin: {
    defaultTexts,
    defaultTextsOptionList,
    categoryUrl,
    loading,
    error,
    state,
  },
}) => {
  const { setValue, getValues, control } = useForm({
    ...fields,
  })

  const items = Object.keys(getValues()) ?? {}

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()

      const payload = {
        post: {
          state: state,
          templates: [],
        },
      }
      const found = subCategories.find(
        (sub) => sub?._links?.self?.public === categoryUrl
      )

      /* istanbul ignore else */
      if (found) {
        const [, main_slug] = found._links.self.public.match(reCategory)
        payload.subcategory = found
        payload.main_slug = main_slug
        payload.status = statusList.find(({ key }) => key === state)

        payload.post.templates = Object.values(getValues()).reduce(
          (acc, item) => {
            if (item.text && item.title) {
              acc.push(item)
            }
            return acc
          },
          []
        )

        onSubmitTexts(payload)
      }
    },
    [state, subCategories, categoryUrl, getValues, onSubmitTexts]
  )

  useEffect(() => {
    Object.keys(fields)?.forEach((item, index) => {
      const empty = { title: '', text: '' }
      const data = defaultTexts[index] || {}
      setValue(item, { ...empty, ...data })
    })
  }, [defaultTexts, getValues, setValue])

  const changeOrdering = useCallback(
    (e, index, type) => {
      e.preventDefault()
      onOrderDefaultTexts({ index, type })
    },
    [onOrderDefaultTexts]
  )

  return (
    <Row>
      <Column span={12}>
        <StyledH1>Beheer standaard teksten</StyledH1>
      </Column>

      {!subCategories && <LoadingIndicator />}

      <Column span={4}>
        {subCategories && (
          <SelectForm
            defaultTextsOptionList={defaultTextsOptionList}
            onFetchDefaultTexts={onFetchDefaultTexts}
          />
        )}
      </Column>

      <Column span={8}>
        {subCategories && categoryUrl && !loading && !error && (
          <StyledWrapper>
            <form className="default-texts-form__form">
              <HiddenInput name={'state'} value={state} />
              <HiddenInput name={'categoryUrl'} value={categoryUrl} />
              {items.map((item, index) => (
                <Controller
                  key={item}
                  name={item}
                  control={control}
                  render={({ field: { name, value } }) => (
                    <DefaultTextsForm
                      item={name}
                      index={index}
                      itemsLength={items.length}
                      value={value}
                      nextValue={getValues()[items[index + 1]]}
                      setValue={setValue}
                      changeOrdering={changeOrdering}
                    />
                  )}
                />
              ))}
            </form>
          </StyledWrapper>
        )}
      </Column>

      <StyledFormFooter submitBtnLabel="Opslaan" onSubmitForm={handleSubmit} />
    </Row>
  )
}

DefaultTextsAdminContainer.defaultProps = {
  defaultTextsAdmin: {
    defaultTexts: [],
    defaultTextsOptionList: [],
    categoryUrl: null,
    state: 'o',
  },
}

DefaultTextsAdminContainer.propTypes = {
  defaultTextsAdmin: PropTypes.shape({
    defaultTexts: defaultTextsType,
    defaultTextsOptionList: dataListType,
    categoryUrl: PropTypes.string,
    state: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.bool,
  }),
  subCategories: dataListType,

  onFetchDefaultTexts: PropTypes.func.isRequired,
  onSubmitTexts: PropTypes.func.isRequired,
  onOrderDefaultTexts: PropTypes.func.isRequired,
}

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onFetchDefaultTexts: fetchDefaultTexts,
      onSubmitTexts: storeDefaultTexts,
      onOrderDefaultTexts: orderDefaultTexts,
    },
    dispatch
  )

const mapStateToProps = createStructuredSelector({
  defaultTextsAdmin: makeSelectDefaultTextsAdmin(),
  subCategories: makeSelectSubCategories,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

const withReducer = injectReducer({ key: 'defaultTextsAdmin', reducer })
const withSaga = injectSaga({ key: 'defaultTextsAdmin', saga })

export default compose(
  withReducer,
  withSaga,
  withConnect
)(DefaultTextsAdminContainer)
