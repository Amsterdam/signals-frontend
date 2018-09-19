import setClassification from './index';

describe('The set classification service', () => {
  it('should return Overig by default', () => {
    expect(setClassification()).toEqual({
      category: 'Overig',
      subcategory: 'Overig'
    });
  });

  it('should return correct classification when minimum subcategory chance is met', () => {
    expect(
      setClassification({
        hoofdrubriek: [
          [
            'Overlast van en door personen of groepen',
            'Afval',
            'Overlast in de openbare ruimte'
          ],
          [0.32405101692765315, 0.2840341890693276, 0.24243376736492095]
        ],
        subrubriek: [
          [
            'Honden(poep)',
            'Wildplassen / poepen / overgeven',
            'Veeg- / zwerfvuil'
          ],
          [0.40, 0.1424216693948545, 0.04586915076913858]
        ]
      })
    ).toEqual({
      category: 'Overlast van en door personen of groepen',
      subcategory: 'Honden(poep)'
    });
  });

  it('should return Oberig when minimum subcategory chance is met', () => {
    expect(
      setClassification({
        hoofdrubriek: [
          [
            'Overlast van en door personen of groepen',
            'Afval',
            'Overlast in de openbare ruimte'
          ],
          [0.32405101692765315, 0.2840341890693276, 0.24243376736492095]
        ],
        subrubriek: [
          [
            'Honden(poep)',
            'Wildplassen / poepen / overgeven',
            'Veeg- / zwerfvuil'
          ],
          [0.39, 0.1424216693948545, 0.04586915076913858]
        ]
      })
    ).toEqual({
      category: 'Overig',
      subcategory: 'Overig'
    });
  });
});
