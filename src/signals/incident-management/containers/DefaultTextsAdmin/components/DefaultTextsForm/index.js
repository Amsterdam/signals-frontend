import React, { Fragment, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';
import { Button, themeColor } from '@datapunt/asc-ui';
import styled from 'styled-components';

import { dataListType, defaultTextsType } from 'shared/types';

import FieldControlWrapper from 'signals/incident-management/components/FieldControlWrapper';
import TextInput from 'signals/incident-management/components/TextInput';
import TextAreaInput from 'signals/incident-management/components/TextAreaInput';
import HiddenInput from 'signals/incident-management/components/HiddenInput';
import { reCategory } from 'shared/services/resolveClassification';
import { statusList } from 'signals/incident-management/definitions';

import { ChevronDown, ChevronUp } from '@datapunt/asc-assets';

const StyledWrapper = styled.div`
  margin-top: 33px;
  flex-basis: 100%;
`;

const StyledLeftColumn = styled.div`
  display: inline-block;
  width: 70%;
  margin-right: 5%;
  vertical-align: top;
`;

const StyledRightColumn = styled.div`
  display: inline-block;
  width: 10%;
  vertical-align: top;
`;

const StyledButton = styled(Button)`
  border: 1px solid ${themeColor('tint', 'level7')};

  & + button:not([disabled]) {
    margin-top: -1px;
  }
`;

const DEFAULT_TEXT_FIELDS = 15;

const fields = [...new Array(DEFAULT_TEXT_FIELDS).keys()].reduce(
  (acc, key) => ({
    ...acc,
    [`item${key}`]: FormBuilder.group({
      title: [''],
      text: [''],
    }),
  }),
  {}
);

const DefaultTextsForm = ({ categoryUrl, state, defaultTexts, subCategories, onSubmitTexts, onOrderDefaultTexts }) => {
  const form = useMemo(
    () =>
      FormBuilder.group({
        ...fields,
        categoryUrl: null,
        state: null,
      }),
    []
  );
  const items = Object.keys(form.controls).slice(0, -2);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      const category = form.get('categoryUrl').value;
      const payload = {
        post: {
          state: form.get('state').value,
          templates: [],
        },
      };
      const found = subCategories.find(sub => sub?._links?.self?.public === category);

      /* istanbul ignore else */
      if (found) {
        const [, main_slug] = found._links.self.public.match(reCategory);
        payload.subcategory = found;
        payload.main_slug = main_slug;
        payload.status = statusList.find(({ key }) => key === form.get('state').value);

        items.forEach(item => {
          const data = form.get(item).value;

          if (data.text && data.title) {
            payload.post.templates.push({ ...data });
          }
        });

        onSubmitTexts(payload);
      }

      form.updateValueAndValidity();
    },
    [form, onSubmitTexts, subCategories, items]
  );

  const changeOrdering = useCallback(
    (e, index, type) => {
      e.preventDefault();

      onOrderDefaultTexts({ index, type });
      form.updateValueAndValidity();
    },
    [form, onOrderDefaultTexts]
  );

  useEffect(() => {
    items.forEach((item, index) => {
      const empty = { title: '', text: '' };
      const data = defaultTexts[index] || {};
      form.get(item).patchValue({ ...empty, ...data });
    });

    form.updateValueAndValidity();
  }, [defaultTexts, form, items]);

  useEffect(() => {
    form.patchValue({ categoryUrl });
    form.updateValueAndValidity();
  }, [categoryUrl, form]);

  useEffect(() => {
    form.patchValue({ state });
    form.updateValueAndValidity();
  }, [form, state]);

  return (
    <StyledWrapper>
      <FieldGroup
        control={form}
        render={({ invalid }) => (
          <form data-testid="defaultTextFormForm" onSubmit={handleSubmit} className="default-texts-form__form">
            <FieldControlWrapper render={HiddenInput} name="state" control={form.get('state')} />
            <FieldControlWrapper render={HiddenInput} name="categoryUrl" control={form.get('categoryUrl')} />

            {items.map((item, index) => (
              <Fragment key={item}>
                <StyledLeftColumn>
                  <FieldControlWrapper
                    placeholder="Titel"
                    render={TextInput}
                    name={`title${index}`}
                    control={form.get(`${item}.title`)}
                  />

                  <FieldControlWrapper
                    placeholder="Tekst"
                    render={TextAreaInput}
                    name={`text${index}`}
                    control={form.get(`${item}.text`)}
                  />
                </StyledLeftColumn>
                <StyledRightColumn>
                  <StyledButton
                    size={44}
                    variant="blank"
                    data-testid={`defaultTextFormItemButton${index}Up`}
                    disabled={index === 0 || !form.get(`${item}.text`).value}
                    iconSize={16}
                    icon={<ChevronUp />}
                    onClick={e => changeOrdering(e, index, 'up')}
                  />
                  <StyledButton
                    size={44}
                    variant="blank"
                    data-testid={`defaultTextFormItemButton${index}Down`}
                    disabled={index === items.length - 1 || !form.get(`item${index + 1}.text`).value}
                    iconSize={16}
                    icon={<ChevronDown />}
                    onClick={e => changeOrdering(e, index, 'down')}
                  />
                </StyledRightColumn>
              </Fragment>
            ))}

            <div>
              <Button data-testid="defaultTextFormSubmitButton" variant="secondary" type="submit" disabled={invalid}>
                Opslaan
              </Button>
            </div>
          </form>
        )}
      />
    </StyledWrapper>
  );
};

DefaultTextsForm.defaultProps = {
  defaultTexts: [],
  categoryUrl: '',
  subCategories: [],
  state: '',
};

DefaultTextsForm.propTypes = {
  defaultTexts: defaultTextsType,
  subCategories: dataListType,
  categoryUrl: PropTypes.string,
  state: PropTypes.string,

  onSubmitTexts: PropTypes.func.isRequired,
  onOrderDefaultTexts: PropTypes.func.isRequired,
};

export default DefaultTextsForm;
