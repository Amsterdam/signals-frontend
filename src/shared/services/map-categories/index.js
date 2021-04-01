// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
function mapCategories(data) {
  const main = [];
  const sub = [];
  const mainToSub = {};

  if (data && data.results) {
    data.results.forEach(category => {
      main.push({
        key: category._links && category._links.self && category._links.self.href,
        value: category.name,
        slug: category.slug,
      });

      mainToSub[category.slug] = [];

      category.sub_categories.forEach(subcategory => {
        if (subcategory && subcategory.is_active) {
          sub.push({
            key: subcategory._links && subcategory._links.self && subcategory._links.self.href,
            value: subcategory.name,
            slug: subcategory.slug,
            category_slug: category.slug,
            handling_message: subcategory.handling_message,
          });

          mainToSub[category.slug].push({
            id: subcategory._links && subcategory._links.self && subcategory._links.self.href,
            value: subcategory.name,
            slug: subcategory.slug,
            category_slug: category.slug,
            handling_message: subcategory.handling_message,
          });
        }
      });
    });
  }

  return { main, sub, mainToSub };
}

export default mapCategories;
