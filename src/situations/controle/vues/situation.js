import { Bac } from 'controle/modeles/bac';
import { PIECE_CONFORME, PIECE_DEFECTUEUSE } from 'controle/modeles/piece';
import { VueBac } from 'controle/vues/bac';
import { VuePiece } from 'controle/vues/piece';

export class VueSituation {
  constructor (situation, callbackApresCreationPiece) {
    function nouveauBac (categorie, { x, y }) {
      return new Bac({ categorie, x, y, largeur: 30, hauteur: 40 });
    }

    function creeBacs () {
      const bacs = [];
      bacs.push(nouveauBac(PIECE_CONFORME, { x: 10, y: 10 }));
      bacs.push(nouveauBac(PIECE_DEFECTUEUSE, { x: 10, y: 10 }));
      return bacs;
    }

    this.situation = situation;
    this.callbackApresCreationPiece = callbackApresCreationPiece;
    this._bacs = creeBacs();
  }

  bacs () {
    return this._bacs;
  }

  affiche (pointInsertion, $) {
    function afficheBac (categorie, { x, y }) {
      const bac = new Bac({ categorie: categorie, x: x, y: y, largeur: 30, hauteur: 40 });
      const vueBac = new VueBac(bac);
      vueBac.affiche(pointInsertion, $);
    }

    afficheBac(PIECE_CONFORME, { x: 10, y: 10 });
    afficheBac(PIECE_DEFECTUEUSE, { x: 60, y: 10 });

    let identifiantIntervalle = setInterval(() => {
      if (this.situation.sequenceTerminee()) {
        clearInterval(identifiantIntervalle);
        return;
      }

      let piece = this.situation.pieceSuivante();
      let vuePiece = new VuePiece(piece, this.situation.dureeViePiece(), this.callbackApresCreationPiece);
      vuePiece.affiche(pointInsertion, $);
    }, this.situation.cadenceArriveePieces());
  }
}
