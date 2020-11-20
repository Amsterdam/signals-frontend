export const formatWeekOrWorkdays = (days, isCalendarDays) => {
  const dayString = days === 1 ? 'dag' : 'dagen';
  return isCalendarDays ? dayString : `werk${dayString}`;
};

const getDaysString = (days, isCalendarDays) => `${days} ${formatWeekOrWorkdays(days, isCalendarDays)}`;

export const getHandlingTimesBySlugFromSubcategories = subcategories =>
  (subcategories || []).reduce(
    (acc, { slug, sla }) => ({
      ...acc,
      [slug]: getDaysString(sla.n_days, sla.use_calendar_days),
    }),
    {}
  );
