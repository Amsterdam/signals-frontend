// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { SET_CAN_VIEW, SET_IS_RESPONSIBLE } from '../constants';
import { setCanView, setIsResponsible } from '../actions';

describe('signals/settings/departments/Detail/components/CategoryLists/actions', () => {
  test('setCanView', () => {
    const slug = 'afval';
    const subCategories = [{ id: 1 }, { id: 2 }];

    const payload = { slug, subCategories };
    expect(setCanView(payload)).toEqual({
      type: SET_CAN_VIEW,
      payload,
    });
  });

  test('setIsResponsible', () => {
    const slug = 'overlast';
    const subCategories = [{ id: 0 }, { id: 3 }];

    const payload = { slug, subCategories };
    expect(setIsResponsible(payload)).toEqual({
      type: SET_IS_RESPONSIBLE,
      payload,
    });
  });
});
