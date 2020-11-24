import { getDaysString } from '../date-utils';

export const getHandlingTimesBySlugFromSubcategories = subcategories =>
  (subcategories || []).reduce(
    (acc, { slug, sla }) => ({
      ...acc,
      [slug]: getDaysString(sla.n_days, sla.use_calendar_days),
    }),
    {}
  );
