import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import { Row, Column, Button, themeColor  } from '@datapunt/asc-ui';
import styled from 'styled-components';

import { dataListType, defaultTextsType } from 'shared/types';

import FieldControlWrapper from 'signals/incident-management/components/FieldControlWrapper';
import TextInput from 'signals/incident-management/components/TextInput';
import TextAreaInput from 'signals/incident-management/components/TextAreaInput';
import HiddenInput from 'signals/incident-management/components/HiddenInput';

import { ChevronDown, ChevronUp } from '@datapunt/asc-assets';

const StyledWrapper = styled.div`
  margin-top: 33px;
  width: 100%;
`;

const StyledColumn = styled(Column)`
  display: block;
`;

const StyledButton = styled(Button)`
  border: 1px solid ${themeColor('tint', 'level7')};

  & + button:not([disabled]) {
    margin-top: -1px;
  }
`;
export const form = FormBuilder.group({
  item0: FormBuilder.group({
    title: [''],
    text: [''],
  }),
  item1: FormBuilder.group({
    title: [''],
    text: [''],
  }),
  item2: FormBuilder.group({
    title: [''],
    text: [''],
  }),
  item3: FormBuilder.group({
    title: [''],
    text: [''],
  }),
  item4: FormBuilder.group({
    title: [''],
    text: [''],
  }),
  item5: FormBuilder.group({
    title: [''],
    text: [''],
  }),
  item6: FormBuilder.group({
    title: [''],
    text: [''],
  }),
  item7: FormBuilder.group({
    title: [''],
    text: [''],
  }),
  item8: FormBuilder.group({
    title: [''],
    text: [''],
  }),
  item9: FormBuilder.group({
    title: [''],
    text: [''],
  }),
  categoryUrl: ['', Validators.required],
  state: ['', Validators.required],
});

const items = Object.keys(form.controls).slice(0, -2);

const DefaultTextsForm =({
  categoryUrl,
  state,
  defaultTexts,
  subCategories,
  onSubmitTexts,
  onOrderDefaultTexts,
  onSaveDefaultTextsItem,
}) => {
  const handleSubmit = e => {
    e.preventDefault();

    const category = form.get('categoryUrl').value;
    const payload = {
      post: {
        state: form.get('state').value,
        templates: [],
      },
    };
    const found = subCategories.find(
      sub => sub.key === category,
    );
    /* istanbul ignore else */
    if (found && found.slug && found.category_slug) {
      payload.sub_slug = found.slug;
      payload.main_slug = found.category_slug;

      items.forEach(item => {
        const data = form.get(item).value;
        if (data.text && data.title) {
          payload.post.templates.push({ ...data });
        }
      });
      onSubmitTexts(payload);
    }

    form.updateValueAndValidity();
  };

  const changeOrdering = (e, index, type) => {
    e.preventDefault();
    onOrderDefaultTexts({ index, type });
    form.updateValueAndValidity();
  };

  const subscribe = () => {
    items.forEach((item, index) => {
      form.get(item).valueChanges.subscribe(data => {
        onSaveDefaultTextsItem({ index, data });
      });
    });
  };

  const unsubscribe = () => {
    items.forEach(item => {
      form.get(item).valueChanges.unsubscribe();
    });
  };

  useEffect(() => {
    // items.forEach((item, index) => {
    // if (defaultTexts.length && defaultTexts[index]) {
    // form.get(item).patchValue(defaultTexts[index]);
    // }
    // });
    subscribe();

    return unsubscribe;
  }, []);


  useEffect(() => {
    unsubscribe();

    items.forEach((item, index) => {
      const empty = { title: '', text: '' };
      const data = defaultTexts[index] || {};
      form.get(item).patchValue({ ...empty, ...data });
    });

    subscribe();
    form.updateValueAndValidity();
  }, [defaultTexts]);

  useEffect(() => {
    form.patchValue({ categoryUrl });
    form.updateValueAndValidity();
  }, [categoryUrl]);

  useEffect(() => {
    form.patchValue({state});
    form.updateValueAndValidity();
  }, [state]);

  return (
    <StyledWrapper>
      <FieldGroup
        control={form}
        render={({ invalid }) => (
          <form
            data-testid="defaultTextFormForm"
            onSubmit={handleSubmit}
            className="default-texts-form__form"
          >
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
              <Row key={item}>
                <StyledColumn span={7}>
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
                </StyledColumn>
                <StyledColumn span={1}>
                  <StyledButton
                    size={44}
                    variant="blank"
                    data-testid={`defaultTextFormItemButton${index}Up`}
                    disabled={
                      index === 0 || !form.get(`${item}.text`).value
                    }
                    iconSize={16}
                    icon={<ChevronUp />}
                    onClick={e => changeOrdering(e, index, 'up')}
                  />
                  <StyledButton
                    size={44}
                    variant="blank"
                    data-testid={`defaultTextFormItemButton${index}Down`}
                    disabled={
                      index === items.length - 1
                      || !form.get(`item${index + 1}.text`).value
                    }
                    iconSize={16}
                    icon={<ChevronDown />}
                    onClick={e => changeOrdering(e, index, 'down')}
                  />
                </StyledColumn>
              </Row>
            ))}

            <Button
              data-testid="defaultTextFormSubmitButton"
              variant="secondary"
              type="submit"
              disabled={invalid}
            >
              Opslaan
            </Button>
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
  onSaveDefaultTextsItem: PropTypes.func.isRequired,
};

export default DefaultTextsForm;
