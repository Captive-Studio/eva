import { shallowMount } from '@vue/test-utils';
import { creeStore } from 'securite/store/store';
import FenetreZone from 'securite/vues/fenetre_zone';
import FormulaireRadio from 'securite/vues/formulaire_radio';

describe('Le composant FenetreZone', function () {
  let wrapper;
  let store;

  beforeEach(function () {
    store = creeStore();
    wrapper = shallowMount(FenetreZone, {
      store,
      propsData: {
        zone: {}
      }
    });
  });

  it("affiche le formulaire pour dire si c'est un danger ou non", function () {
    expect(wrapper.contains(FormulaireRadio)).to.be(true);
  });

  it('définis la position bottom à partir des infos de la zone', function () {
    wrapper.setProps({ zone: { y: 70, r: 3 } });
    expect(wrapper.vm.bottom).to.eql('32.1%');
    expect(wrapper.vm.top).to.eql(undefined);
  });

  it('définis la position à partir des infos de la zone', function () {
    wrapper.setProps({ zone: { x: 4, r: 1 } });
    expect(wrapper.vm.left).to.eql('4.7%');
    expect(wrapper.vm.right).to.eql(undefined);
  });

  it('définis la position pour mettre la boite a gauche la zone', function () {
    wrapper.setProps({ zone: { x: 80, r: 1 } });
    expect(wrapper.vm.left).to.eql(undefined);
    expect(wrapper.vm.right).to.eql('20.7%');
  });

  it('définis la position pour mettre la boite en bas à droite de la zone', function () {
    wrapper.setProps({ zone: { y: 40, r: 1 } });
    expect(wrapper.vm.bottom).to.eql(undefined);
    expect(wrapper.vm.top).to.eql('40.7%');
  });

  describe('avec une zone et un danger associé', function () {
    let zone;
    let danger;

    beforeEach(function () {
      zone = { x: 4, r: 1, danger: 'danger1' };
      danger = { qualifications: [] };
      store.commit('chargeZonesEtDangers', { zones: [zone], dangers: { danger1: danger } });
      wrapper.setProps({ zone });
    });

    it('envoit les options de qualification', function () {
      expect(wrapper.vm.qualificationDanger.options).to.equal(danger.qualifications);
    });

    it('envoit le choix selectionné', function () {
      expect(wrapper.vm.qualificationDanger.choix).to.equal('');
      store.commit('ajouteDangerQualifie', { nom: zone.danger, choix: 'choix1' });
      expect(wrapper.vm.qualificationDanger.choix).to.equal('choix1');
    });

    it("rend la question d'identification du danger puis de qualification puis c'est terminé", function () {
      expect(wrapper.vm.etat).to.equal('identification');
      wrapper.vm.question.submit();
      expect(wrapper.vm.etat).to.equal('qualification');
      wrapper.vm.question.submit();
      expect(wrapper.emitted('ferme').length).to.equal(1);
    });

    it('mets à jour le store pour stocker le danger qualifié', function (done) {
      wrapper.vm.etat = 'qualification';
      store.commit = (mutation, donnees) => {
        expect(mutation).to.equal('ajouteDangerQualifie');
        expect(donnees).to.eql({ nom: 'danger1', choix: 'qualification1' });
        done();
      };
      wrapper.vm.question.submit('qualification1');
    });

    it('une fois le danger qualifié, on ne peut que modifier la qualification', function () {
      store.commit('ajouteDangerQualifie', { nom: zone.danger, choix: 'choix1' });
      const wrapper = shallowMount(FenetreZone, {
        store,
        propsData: { zone }
      });
      expect(wrapper.vm.etat).to.equal('qualification');
    });
  });

  describe('avec une zone sans danger associé', function () {
    beforeEach(function () {
      const zone = { x: 4, r: 1 };
      store.commit('chargeZonesEtDangers', { zones: [zone], dangers: {} });
      wrapper.setProps({ zone });
    });

    it("ne propose que l'étape d'identification", function () {
      expect(wrapper.vm.etat).to.equal('identification');
      wrapper.vm.question.submit();
      expect(wrapper.emitted('ferme').length).to.equal(1);
    });
  });
});
