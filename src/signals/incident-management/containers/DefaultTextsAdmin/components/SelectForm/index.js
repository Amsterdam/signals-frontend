import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import { dataListType } from 'shared/types';
import { reCategory } from 'shared/services/resolveClassification';

import FieldControlWrapper from 'signals/incident-management/components/FieldControlWrapper';
import SelectInput from 'signals/incident-management/components/SelectInput';
import RadioInput from 'signals/incident-management/components/RadioInput';
import HiddenInput from 'signals/incident-management/components/HiddenInput';

const form = FormBuilder.group({
  category_url: null,
  state: 'o',
  sub_slug: null,
  main_slug: null,
});

const SelectForm = ({ subCategories, defaultTextsOptionList, onFetchDefaultTexts }) => {
  const handleChange = useCallback(
    changed => {
      const newValues = {
        ...form.value,
        ...changed,
      };

      onFetchDefaultTexts(newValues);
    },
    [onFetchDefaultTexts]
  );

  useEffect(() => {
    form.controls.category_url.valueChanges.subscribe(category_url => {
      const found = category_url && subCategories.find(sub => sub?._links?.self?.public === category_url);

      /* istanbul ignore else */
      if (found) {
        const [, main_slug, sub_slug] = found._links.self.public.match(reCategory);

        form.patchValue({
          sub_slug,
          main_slug,
        });

        handleChange({ category_url });
      }
    });

    form.controls.state.valueChanges.subscribe(state => {
      handleChange({ state });
    });

    const firstCategoryUrl = subCategories[0]?._links?.self?.public;
    if (firstCategoryUrl) {
      form.patchValue({
        category_url: firstCategoryUrl,
      });
    }

    return () => {
      form.controls.category_url.valueChanges.unsubscribe();
      form.controls.state.valueChanges.unsubscribe();
    };
  }, [handleChange, subCategories]);

  useEffect(() => {
    // subs = subCategories;
    form.updateValueAndValidity();
  }, [subCategories]);

  return (
    <FieldGroup
      control={form}
      render={() => (
        <form data-testid="selectFormForm" className="select-form__form">
          <FieldControlWrapper
            render={SelectInput}
            display="Subcategorie"
            name="category_url"
            values={subCategories}
            control={form.get('category_url')}
            emptyOptionText="Kies"
            sort
          />
          <FieldControlWrapper
            display="Status"
            render={RadioInput}
            name="state"
            values={defaultTextsOptionList}
            control={form.get('state')}
          />

          <FieldControlWrapper render={HiddenInput} name="sub_slug" control={form.get('sub_slug')} />
          <FieldControlWrapper render={HiddenInput} name="main_slug" control={form.get('main_slug')} />
        </form>
      )}
    />
  );
};

SelectForm.propTypes = {
  subCategories: dataListType.isRequired,
  defaultTextsOptionList: dataListType.isRequired,

  onFetchDefaultTexts: PropTypes.func.isRequired,
};

export default SelectForm;
