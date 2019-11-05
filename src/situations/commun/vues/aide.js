import { traduction } from 'commun/infra/internationalisation';
import aide from 'commun/assets/aide.svg';
import VueBouton from './bouton';

import 'commun/styles/bouton.scss';
import 'commun/styles/aide.scss';

export default class VueAide {
  affiche (pointInsertion, $) {
    const boutonAide = new VueBouton('bouton-aide', aide, () => { });
    boutonAide.ajouteUneEtiquette(traduction('situation.activer_aide'));
    boutonAide.affiche(pointInsertion, $);
  }
}