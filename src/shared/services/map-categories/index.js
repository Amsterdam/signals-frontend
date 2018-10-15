function mapCategories(data) {
  const categories = [];
  const subcategories = [];

  if (data && data.results) {
    data.results.forEach((category) => {
      categories.push({
        key: category._links && category._links.self && category._links.self.href,
        value: category._display
      });

      category.sub_categories.forEach((subcategory) => {
        subcategories.push({
          key: subcategory._links && subcategory._links.self && subcategory._links.self.href,
          value: subcategory._display
        });
      });
    });
  }

  return { categories, subcategories };
}

export default mapCategories;
