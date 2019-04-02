import SituationCommune from 'commun/modeles/situation';
import { nouvelInventaireReference } from './inventaireReference';
import { Contenant } from './contenant';

function inventaireProduits ({ contenants, contenus }) {
  var inventaire = new Map();

  contenants.forEach(function (c) {
    let clefProduit = c.idContenu;
    if (!inventaire.has(clefProduit)) {
      inventaire.set(clefProduit, 0);
    }
    inventaire.set(clefProduit, inventaire.get(clefProduit) + c.quantite);
  });

  var resultat = new Map();
  inventaire.forEach(function (quantite, clefProduit) {
    const { nom, image, forme } = contenus[clefProduit];
    resultat.set(clefProduit, { nom, image, quantite, forme });
  });

  return resultat;
}

function creerContenants ({ contenants, contenus }) {
  return contenants.map((contenant) => {
    const contenu = contenus[contenant.idContenu];
    return new Contenant(contenant, contenu);
  });
}

export class Situation extends SituationCommune {
  constructor (unStock) {
    super();
    this.produits = inventaireProduits(unStock);
    this.contenants = creerContenants(unStock);
  }

  inventaireReference () {
    return nouvelInventaireReference(this.produits);
  }

  produitsEnStock () {
    return this.produits;
  }
}
