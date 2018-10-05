function mapCategories(data) {
  const categories = [];
  const subcacategories = [];

  if (data && data.results) {
    data.results.map((c) => {
      categories.push({
        key: c.slug,
        value: c._display
      });

      c.sub_categories.map((s) => {
        subcacategories.push({
          key: s.slug,
          value: s._display,
          parent: c.slug
        });

        return true;
      });

      return true;
    });
  }

  return { categories, subcacategories };
}

export default mapCategories;
