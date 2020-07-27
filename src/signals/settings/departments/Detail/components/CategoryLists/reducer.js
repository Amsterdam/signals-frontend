import { SET_CAN_VIEW, SET_IS_RESPONSIBLE } from './constants';

export const initialState = {
  can_view: {},
  is_responsible: {},
};

export default (state, action) => {
  switch (action.type) {
    case SET_CAN_VIEW:
      return {
        ...state,
        can_view: {
          ...state.can_view,
          [action.payload.slug]: action.payload.subCategories
            // mark categories that are also present in is_responsible state
            // as disabled
            .map(category => {
              const isAlsoResponsible = Boolean(
                (state.is_responsible[action.payload.slug] || []).find(
                  ({ id }) => id === category.id
                )
              );

              return {
                ...category,
                disabled: isAlsoResponsible,
              };
            })
            // and combine them with categories that are present in
            // is_responsible state, but not in the payload
            .concat(
              (state.is_responsible[action.payload.slug] || [])
                .filter(
                  category =>
                    !action.payload.subCategories.find(
                      ({ id }) => id === category.id
                    )
                )
                .map(category => ({ ...category, disabled: true }))
            ),
        },
      };

    case SET_IS_RESPONSIBLE:
      return {
        is_responsible: {
          ...state.is_responsible,
          [action.payload.slug]: action.payload.subCategories,
        },
        can_view: {
          ...state.can_view,
          [action.payload.slug]: !action.payload.subCategories.length ? // return an empty list when the whole group has been toggled off
            [] :
            (state.can_view[action.payload.slug] || [])
              // take all can_view categories from the state that are not
              // present in the payload
              .filter(
                category =>
                  !action.payload.subCategories.find(
                    ({ id }) => id === category.id
                  )
              )
              // make sure they are not disabled
              .map(category => ({
                ...category,
                disabled: false,
              }))
              // and combine them with the categories from the payload, marking
              // all from the payload as disabled
              .concat(
                action.payload.subCategories.map(category => ({
                  ...category,
                  disabled: true,
                }))
              ),
        },
      };

    default:
      return state;
  }
};
