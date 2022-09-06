// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
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
import { FormBuilder, FieldGroup } from 'react-reactive-form'
import { useCallback, useEffect, useMemo } from 'react'
import { reCategory } from '../../../../shared/services/resolveClassification'
import { statusList } from '../../definitions'
import HiddenInput from '../../components/HiddenInput'
import FieldControlWrapper from '../../components/FieldControlWrapper'
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
    [`item${key}`]: FormBuilder.group({
      title: [''],
      text: [''],
      is_active: [false],
    }),
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
  const form = useMemo(
    () =>
      FormBuilder.group({
        ...fields,
        categoryUrl: null,
        state: null,
      }),
    []
  )
  const items = Object.keys(form.controls).slice(0, -2)

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()

      const category = form.get('categoryUrl').value
      const payload = {
        post: {
          state: form.get('state').value,
          templates: [],
        },
      }
      const found = subCategories.find(
        (sub) => sub?._links?.self?.public === category
      )

      /* istanbul ignore else */
      if (found) {
        const [, main_slug] = found._links.self.public.match(reCategory)
        payload.subcategory = found
        payload.main_slug = main_slug
        payload.status = statusList.find(
          ({ key }) => key === form.get('state').value
        )

        items.forEach((item) => {
          const data = form.get(item).value

          if (data.text && data.title) {
            payload.post.templates.push({ ...data })
          }
        })

        onSubmitTexts(payload)
      }

      form.updateValueAndValidity()
    },
    [form, onSubmitTexts, subCategories, items]
  )

  useEffect(() => {
    items.forEach((item, index) => {
      const empty = { title: '', text: '' }
      const data = defaultTexts[index] || {}
      form.get(item).patchValue({ ...empty, ...data })
    })

    form.updateValueAndValidity()
  }, [defaultTexts, form, items])

  useEffect(() => {
    form.patchValue({ categoryUrl })
    form.updateValueAndValidity()
  }, [categoryUrl, form])

  useEffect(() => {
    form.patchValue({ state })
    form.updateValueAndValidity()
  }, [form, state])

  const changeOrdering = useCallback(
    (e, index, type) => {
      e.preventDefault()

      onOrderDefaultTexts({ index, type })
      form.updateValueAndValidity()
    },
    [form, onOrderDefaultTexts]
  )

  const onCheck = useCallback(
    (item, oldValue) => {
      const itemData = form.get(item)
      form.get(item).patchValue({ ...itemData, is_active: !oldValue })
    },
    [form]
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
            <FieldGroup
              control={form}
              render={() => (
                <form className="default-texts-form__form">
                  <FieldControlWrapper
                    render={HiddenInput}
                    name="state"
                    control={form.get('state')}
                  />
                  <FieldControlWrapper
                    render={HiddenInput}
                    name="categoryUrl"
                    control={form.get('categoryUrl')}
                  />
                  {items.map((item, index) => (
                    <DefaultTextsForm
                      key={item}
                      item={item}
                      index={index}
                      itemsLength={items.length}
                      form={form}
                      onCheck={onCheck}
                      changeOrdering={changeOrdering}
                    />
                  ))}
                </form>
              )}
            />
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
