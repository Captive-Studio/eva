import { Piece } from 'controle/modeles/piece.js';
import SituationCommune from 'commun/modeles/situation.js';

export class Situation extends SituationCommune {
  constructor ({ cadence, scenario, dureeViePiece, positionApparitionPieces }) {
    super();
    this.cadence = cadence;
    this.scenario = scenario;
    this.positionApparition = positionApparitionPieces;
    this._dureeViePiece = dureeViePiece;
  }

  cadenceArriveePieces () {
    return this.cadence;
  }

  dureeViePiece () {
    return this._dureeViePiece;
  }

  sequenceTerminee () {
    return this.scenario.length === 0;
  }

  pieceSuivante () {
    const estConforme = this.scenario.shift();
    return new Piece({ x: this.positionApparition.x, y: this.positionApparition.y, conforme: estConforme });
  }
}
