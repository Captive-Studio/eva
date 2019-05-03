import VueBouton from './bouton';
import 'commun/styles/action_overlay.scss';

export default class VueActionOverlay {
  constructor (image, message, classe, classeBouton) {
    this.image = image;
    this.message = message;
    this.classe = classe;
    this.classeBouton = classeBouton;
    this.vueBouton = new VueBouton(this.classe, this.image, () => this.click());
  }

  affiche (pointInsertion, $) {
    this.$message = $(`<div class='message'>${this.message}</div>`);
    const $conteneurBouton = $(`<div class=${this.classeBouton}></div>`);

    this.vueBouton.affiche($conteneurBouton, $);

    this.$overlay = $('<div class="overlay"></div>');

    this.$overlay.append($conteneurBouton);
    this.$overlay.append(this.$message);

    $(pointInsertion).append(this.$overlay);
  }

  cache ($) {
    this.$overlay.remove();
  }

  click () {}
}
