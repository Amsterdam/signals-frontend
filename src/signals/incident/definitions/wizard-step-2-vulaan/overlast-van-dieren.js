const overlastVanDieren = {
  extra_dieren_text: {
    meta: {
      ifAllOf: {
        category: 'overlast-van-dieren',
      },
      type: 'caution',
      value: `
Let op: u kunt met dit formulier een melding doen van:

* dierplagen (ratten, ganzen, duiven, meeuwen,wespen, etc)
* dode dieren op straat, met uitzondering van dode huisdieren en dode vogels
* Voor dode huisdieren en dode vogels op straat kunt u contact opnemen met [Dierenambulance Amsterdam](https://www.dierenambulance-amsterdam.nl/dieren/).
* Voor alle andere gevallen: bezoek onze pagina: [Melden van zieke, mishandelde en dode dieren, of overlast van dieren](https://www.amsterdam.nl/veelgevraagd/?caseid=%7BC46A5854-3DB0-4D7C-9244-58912C2E0E6A%7D).`,
    },
    render: 'PlainText',
  },
};

export default overlastVanDieren;
