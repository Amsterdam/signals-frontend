function mapCategories(data) {
  const main = [];
  const sub = [];
  const mainToSub = {};

  if (data && data.results) {
    data.results.forEach((category) => {
      main.push({
        key: category._links && category._links.self && category._links.self.href,
        value: category.name,
        slug: category.slug
      });

      mainToSub[category.slug] = [];

      category.sub_categories.forEach((subcategory) => {
        if (subcategory && subcategory.is_active) {
          sub.push({
            key: subcategory._links && subcategory._links.self && subcategory._links.self.href,
            value: subcategory.name,
            slug: subcategory.slug,
            category_slug: category.slug,
            handling_message: subcategory.handling_message
          });

          mainToSub[category.slug].push({
            key: subcategory.slug, // replacing 'key' prop since its value isn't used and it makes more sense for the filter form to have to deal with just one prop; 'key'
            value: subcategory.name,
            slug: subcategory.slug,
            category_slug: category.slug,
            handling_message: subcategory.handling_message
          });
        }
      });
    });
  }

  return { main, sub, mainToSub };
}

export default mapCategories;
