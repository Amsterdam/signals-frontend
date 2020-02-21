import { reCategory } from 'shared/services/resolveClassification';
import { initialState } from './reducer';

export const incoming = (departmentCategories, subCategories) =>
  departmentCategories.reduce((acc, departmentCategory) => {
    const category = subCategories.find(
      ({
        _links: {
          self: { public: publicUrl },
        },
      }) => publicUrl === departmentCategory.category._links.self.href
    );
    const [, main_slug] = category._links.self.public.match(reCategory);

    const canViewDisabled =
      departmentCategory.can_view && departmentCategory.is_responsible;

    const can_view = {
      [main_slug]: [
        ...(acc.can_view[main_slug] || []),
        departmentCategory.can_view && {
          ...category,
          disabled: canViewDisabled,
        },
      ].filter(Boolean),
    };
    const is_responsible = {
      [main_slug]: [
        ...(acc.is_responsible[main_slug] || []),
        departmentCategory.is_responsible && category,
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

export const outgoing = state => {
  const isResponsible = Object.entries(
    state.is_responsible
  ).flatMap(([, departmentCategories]) =>
    departmentCategories.map(({ fk }) => ({
      category_id: fk,
      is_responsible: true,
    }))
  );

  const canView = Object.entries(
    state.can_view
  ).flatMap(([, departmentCategories]) =>
    departmentCategories.map(({ fk }) => ({
      category_id: fk,
      can_view: true,
    }))
  );

  return {
    categories: isResponsible.concat(canView),
  };
};
