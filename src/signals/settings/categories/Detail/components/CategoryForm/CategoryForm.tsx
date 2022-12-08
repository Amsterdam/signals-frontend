// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { useCallback, useMemo, useState } from 'react'
import type {
  ChangeEvent,
  FunctionComponent,
  MouseEvent,
  ElementType,
} from 'react'

import { themeSpacing, Row, Column, Select, Label } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Checkbox from 'components/Checkbox'
import FormFooter from 'components/FormFooter'
import History from 'components/History'
import Input from 'components/Input'
import RadioButtonList from 'components/RadioButtonList'
import TextArea from 'components/TextArea'
import type { Category as CategoryType } from 'types/category'
import type { History as HistoryType } from 'types/history'

const Form = styled.form`
  width: 100%;
`

const StyledColumn = styled(Column)`
  contain: content;
  flex-direction: column;
  justify-content: flex-start;
`

const FieldGroup = styled.div`
  & + & {
    margin-top: ${themeSpacing(8)};
  }
`

const StyledFormFooter = styled(FormFooter)`
  position: fixed;
`

const CombinedFields = styled.div`
  display: flex;
  margin-top: ${themeSpacing(1)};

  input {
    flex: 1 0 auto;
    max-width: 75px;
  }

  select {
    flex: 2 1 auto;
  }
`

const StyledSelect = styled(Select)`
  height: 44px;
`

const StyledLabel = styled(Label)`
  font-weight: 400;
`

const StyledHistory = styled(History as ElementType)`
  h2 {
    font-size: inherit;
  }
`

const StyledDefinitionTerm = styled.dt`
  margin-bottom: ${themeSpacing(1)};
`

const StyledHeading = styled.p`
  margin-bottom: ${themeSpacing(1)};
  font-weight: bold;
  line-height: 22px;
  font-size: inherit;
`

const statusOptions = [
  { key: 'true', value: 'Actief' },
  { key: 'false', value: 'Niet actief' },
]

const DEFAULT_STATUS_OPTION = 'true'

export interface CategoryFormProps {
  onCancel: () => void
  onSubmitForm: (event: MouseEvent) => void
  readOnly: boolean
  history: HistoryType[]
  data?: CategoryType
}

const CategoryForm: FunctionComponent<CategoryFormProps> = ({
  data,
  history,
  onCancel,
  onSubmitForm,
  readOnly,
}) => {
  const [isPublicAccessible, setIsPublicAccessible] = useState(
    data?.is_public_accessible ?? false
  )
  const responsibleDepartments = useMemo(
    () =>
      data
        ? data.departments
            .filter((department) => department.is_responsible)
            .map((department) => department.code)
        : [],
    [data]
  )

  const onCheck = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setIsPublicAccessible(event.target.checked)
    },
    [setIsPublicAccessible]
  )

  return (
    <Form action="" data-testid="detailCategoryForm">
      <Row>
        <StyledColumn
          span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 5 }}
        >
          <div>
            <FieldGroup>
              <Input
                defaultValue={data?.name}
                disabled={readOnly}
                hint="Het wijzigen van de naam heeft geen invloed op het type melding"
                id="name"
                label="Naam"
                name="name"
                readOnly={readOnly}
                type="text"
              />
            </FieldGroup>

            <FieldGroup>
              <TextArea
                defaultValue={data?.description ?? undefined}
                disabled={readOnly}
                id="description"
                label={<strong>Omschrijving</strong>}
                name="description"
                readOnly={readOnly}
                rows={6}
              />
            </FieldGroup>

            {responsibleDepartments.length > 0 ? (
              <FieldGroup as="dl">
                <StyledDefinitionTerm>
                  <strong>Verantwoordelijke afdeling</strong>
                </StyledDefinitionTerm>
                <dd data-testid="responsible_departments">
                  {responsibleDepartments.join(', ')}
                </dd>
              </FieldGroup>
            ) : null}

            <FieldGroup>
              <StyledHeading>Openbaar tonen</StyledHeading>
              <>
                <StyledLabel
                  htmlFor="is_public_accessible"
                  label="Toon meldingen van deze subcategorie op openbare kaarten en op de kaart in het meldformulier"
                  data-testid="subcategoryIsPublicAccessible"
                  disabled={readOnly}
                >
                  <input
                    type="hidden"
                    name="is_public_accessible"
                    value="false"
                  />

                  <Checkbox
                    checked={isPublicAccessible}
                    name="is_public_accessible"
                    id="is_public_accessible"
                    onChange={onCheck}
                    value={isPublicAccessible.toString()}
                  />
                </StyledLabel>
              </>
            </FieldGroup>

            {isPublicAccessible && (
              <FieldGroup>
                <Input
                  defaultValue={data?.public_name ?? ''}
                  id="public_name"
                  label="Naam openbaar"
                  name="public_name"
                  type="text"
                  readOnly={readOnly}
                />
              </FieldGroup>
            )}

            <FieldGroup>
              <StyledHeading>Afhandeltermijn</StyledHeading>
              <CombinedFields>
                <Input
                  defaultValue={data?.sla.n_days ?? undefined}
                  disabled={readOnly}
                  id="n_days"
                  name="n_days"
                  readOnly={readOnly}
                  type="number"
                  size={50}
                />

                <StyledSelect
                  defaultValue={data?.sla.use_calendar_days ? 1 : 0}
                  disabled={readOnly}
                  id="use_calendar_days"
                  // @ts-expect-error: native select element supports 'name' attribute, but asc-ui does not provide correct type
                  name="use_calendar_days"
                >
                  <option value="1">Dagen</option>
                  <option value="0">Werkdagen</option>
                </StyledSelect>
              </CombinedFields>
            </FieldGroup>

            <FieldGroup>
              <TextArea
                defaultValue={data?.handling_message}
                disabled={readOnly}
                id="handling_message"
                label={<strong>Servicebelofte</strong>}
                name="handling_message"
                readOnly={readOnly}
                rows={6}
              />
            </FieldGroup>

            <FieldGroup>
              <StyledHeading>Status</StyledHeading>
              <RadioButtonList
                defaultValue={
                  data?.is_active === undefined
                    ? DEFAULT_STATUS_OPTION
                    : `${data.is_active}`
                }
                groupName="is_active"
                hasEmptySelectionButton={false}
                options={statusOptions}
                disabled={readOnly}
              />
            </FieldGroup>
          </div>
        </StyledColumn>

        <StyledColumn
          span={{ small: 1, medium: 2, big: 6, large: 7, xLarge: 6 }}
        >
          <Column span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 5 }}>
            <TextArea
              defaultValue={data?.note || ''}
              disabled={readOnly}
              readOnly={readOnly}
              id="note"
              label={<strong>Notitie</strong>}
              name="note"
              rows={6}
            />
          </Column>
          {history && <StyledHistory list={history} />}
        </StyledColumn>

        {!readOnly && (
          <StyledFormFooter
            cancelBtnLabel="Annuleer"
            onCancel={onCancel}
            submitBtnLabel="Opslaan"
            onSubmitForm={onSubmitForm}
          />
        )}
      </Row>
    </Form>
  )
}

export default CategoryForm
