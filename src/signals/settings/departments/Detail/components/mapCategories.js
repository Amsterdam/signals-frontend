// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { reCategory } from 'shared/services/resolveClassification';
import { initialState } from './CategoryLists/reducer';

/**
 * Incoming API data mapper
 *
 * The department/ endpoint returns categories in a format that is different
 * from the format that is returned from the categories/ endpoint. This
 * function replaces the incoming categories with those categories that have a
 * match in the collection from the output of the categories/ endpoint and
 * groups them by their `can_view` and `is_responsible` props.
 *
 * @param   {Object[]} departmentCategories
 * @param   {Object[]} subCategories
 * @returns {Object} Object with props `can_view` and `is_responsible`
 */
export const incoming = (departmentCategories, subCategories) =>
  departmentCategories.reduce((acc, departmentCategory) => {
    const matchingCategory = subCategories.find(
      ({
        _links: {
          self: { public: publicUrl },
        },
      }) => publicUrl === departmentCategory.category._links.self.href
    );

    if (!matchingCategory) {
      return acc;
    }

    const [, main_slug] = matchingCategory._links.self.public.match(reCategory);

    const canViewDisabled = departmentCategory.is_responsible;

    const can_view = {
      [main_slug]: [
        ...acc.can_view[main_slug] || [],
        departmentCategory.can_view && {
          ...matchingCategory,
          disabled: canViewDisabled,
        },
      ].filter(Boolean),
    };

    const is_responsible = {
      [main_slug]: [
        ...acc.is_responsible[main_slug] || [],
        departmentCategory.is_responsible && matchingCategory,
      ].filter(Boolean),
    };

    return {
      ...acc,
      can_view: {
        ...acc.can_view,
        ...can_view,
      },
      is_responsible: {
        ...acc.is_responsible,
        ...is_responsible,
      },
    };
  }, initialState);

/**
 * Outgoing API data conversion
 *
 * The department detail form data is mapped into a flattened array where both
 * `can_view` and `is_responsible` category collections are concatenated.
 *
 * @param   {Object} state
 * @param   {Object[]} state.can_view
 * @param   {Object[]} state.is_responsible
 * @returns {Object} Object with key `categories` which is an array of objects
 */
export const outgoing = state => {
  const isResponsible = Object.entries(state.is_responsible).flatMap(
    ([, departmentCategories]) =>
      departmentCategories.map(({ fk }) => ({
        category_id: fk,
        is_responsible: true,
      }))
  );

  const canView = Object.entries(state.can_view).flatMap(
    ([, departmentCategories]) =>
      departmentCategories.map(({ fk }) => ({
        category_id: fk,
        can_view: true,
      }))
  );

  // combine both collections and merge objects where possible
  const categories = isResponsible.concat(canView).reduce((acc, category) => {
    const merged = {
      ...acc.find(({ category_id }) => category_id === category.category_id),
      ...category,
    };

    return [
      ...acc.filter(({ category_id }) => category_id !== category.category_id),
      merged,
    ];
  }, []);

  return {
    categories,
  };
};
