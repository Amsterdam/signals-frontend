function mapCategories(data) {
  const categories = [];
  const subcacategories = [];

  if (data && data.results) {
    data.results.map((category) => {
      categories.push({
        key: category._links.self.href,
        value: category._display
      });

      category.sub_categories.map((subcategory) => {
        subcacategories.push({
          key: subcategory._links.self.href,
          value: subcategory._display
        });

        return true;
      });

      return true;
    });
  }

  return { categories, subcacategories };
}

export default mapCategories;
