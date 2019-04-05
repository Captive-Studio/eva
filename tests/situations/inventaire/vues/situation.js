import jsdom from 'jsdom-global';
import { unMagasinVide } from '../aides/magasin';
import { VueSituation } from 'inventaire/vues/situation';
import EvenementDemarrage from 'commun/modeles/evenement_demarrage';

describe('La situation « Inventaire »', function () {
  let $;
  let mockJournal;
  let situation;
  let vue;

  beforeEach(function () {
    jsdom('<div id="point-insertion"></div>');
    $ = jQuery(window);
    mockJournal = {
      enregistre: () => {}
    };
    situation = unMagasinVide();
    vue = new VueSituation(situation, mockJournal);
  });

  it('affiche les étagères', function () {
    expect($('#point-insertion .etageres').length).to.equal(0);

    vue.affiche('#point-insertion', $);

    expect($('#point-insertion .etageres').length).to.equal(1);
  });

  it("incrit le journal à l'événement démarrage", function (done) {
    mockJournal.enregistre = (evenement) => {
      expect(evenement).to.be.a(EvenementDemarrage);
      done();
    };

    situation.notifie(new EvenementDemarrage());
  });
});