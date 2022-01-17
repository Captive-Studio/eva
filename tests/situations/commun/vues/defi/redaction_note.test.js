import { shallowMount } from '@vue/test-utils';
import RedactionNote from 'commun/vues/defi/redaction_note';

describe('Le composant RedactionNote', function () {
  function composant (props) {
    return shallowMount(RedactionNote, { propsData: props });
  }

  it('affiche une zone de saisie de texte', function () {
    const vue = composant({ question: {} });
    expect(vue.find('textarea').exists()).toBe(true);
  });

  it('affiche le placeholder', function () {
    const question = { reponse_placeholder: 'écrire ici' };
    const vue = composant({ question });
    const input = vue.find('textarea');
    expect(input.element.getAttribute('placeholder')).toEqual('écrire ici');
  });

  describe('peut être utilisé avec la propriété v-model', function () {
    it('envoie la réponse dans un événement input', function () {
      const vue = composant({ question: {} });
      const input = vue.find('textarea');
      const reponse = 'Une rédaction de plusieurs\nlignes\n\n';
      input.setValue(reponse);
      expect(vue.emitted('input').length).toEqual(1);
      expect(vue.emitted('input')[0][0]).toEqual({ reponse: 'Une rédaction de plusieurs\nlignes' });
    });
  });
});