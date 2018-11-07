function mapCategories(data) {
  const main = [];
  const sub = [];

  if (data && data.results) {
    data.results.forEach((category) => {
      main.push({
        key: category._links && category._links.self && category._links.self.href,
        value: category.name
      });

      category.sub_categories.forEach((subcategory) => {
        sub.push({
          key: subcategory._links && subcategory._links.self && subcategory._links.self.href,
          value: subcategory.name
        });
      });
    });
  }

  return { main, sub };
}

export default mapCategories;
