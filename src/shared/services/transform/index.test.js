import { getHandlingTimesBySlugFromSubcategories } from '.';
import { subCategories } from 'utils/__tests__/fixtures';

describe('transform service', () => {
  it('should return an object with slugs and handling times which come from subcategories', () => {
    const handlingTimesBySlug = getHandlingTimesBySlugFromSubcategories(subCategories);

    expect(handlingTimesBySlug['afwatering-brug']).toBe('5 werkdagen');
    expect(handlingTimesBySlug['auto-scooter-bromfietswrak']).toBe('21 dagen');
  });
});
