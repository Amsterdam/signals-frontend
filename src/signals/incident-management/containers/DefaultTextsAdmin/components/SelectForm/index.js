import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import { dataListType } from 'shared/types';
import { reCategory } from 'shared/services/resolveClassification';

import FieldControlWrapper from 'signals/incident-management/components/FieldControlWrapper';
import SelectInput from 'signals/incident-management/components/SelectInput';
import RadioInput from 'signals/incident-management/components/RadioInput';
import { useSelector } from 'react-redux';
import { makeSelectMainCategories, makeSelectSubCategories } from 'models/categories/selectors';

const form = FormBuilder.group({
  category_url: null,
  state: 'o',
  sub_slug: null,
  main_slug: null,
});

const SelectForm = ({ defaultTextsOptionList, onFetchDefaultTexts }) => {
  const categories = useSelector(makeSelectMainCategories);
  const subcategoryGroups = useMemo(() => categories?.map(({ slug: value, name }) => ({ name, value })), [categories]);

  const subcategories = useSelector(makeSelectSubCategories);
  const subcategoryOptions = useMemo(
    () =>
      subcategories?.map(({ key, extendedName: name, category_slug, description }) => ({
        key,
        name,
        value: name,
        group: category_slug,
        description,
      })),
    [subcategories]
  );

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
      const found = category_url && subcategoryOptions.find(sub => sub?.key === category_url);

      /* istanbul ignore else */
      if (found) {
        const [, main_slug, sub_slug] = found.key.match(reCategory);

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

    const firstCategoryUrl = subcategoryOptions[0]?.key;
    if (firstCategoryUrl) {
      form.patchValue({
        category_url: firstCategoryUrl,
      });
    }

    return () => {
      form.controls.category_url.valueChanges.unsubscribe();
      form.controls.state.valueChanges.unsubscribe();
    };
  }, [handleChange, subcategoryOptions]);

  useEffect(() => {
    form.updateValueAndValidity();
  }, [subcategoryOptions]);

  return (
    <FieldGroup
      control={form}
      render={() => (
        <form data-testid="selectFormForm" className="select-form__form">
          <FieldControlWrapper
            render={SelectInput}
            display="Subcategorie"
            name="category_url"
            values={subcategoryOptions}
            groups={subcategoryGroups}
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
        </form>
      )}
    />
  );
};

SelectForm.propTypes = {
  defaultTextsOptionList: dataListType.isRequired,

  onFetchDefaultTexts: PropTypes.func.isRequired,
};

export default SelectForm;
