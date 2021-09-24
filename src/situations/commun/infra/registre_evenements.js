import jQuery from 'jquery';
import BaseRegistre from 'commun/infra/base_registre';

export default class RegistreEvenements extends BaseRegistre {
  constructor (registreUtilisateur, $ = jQuery) {
    super($);
    this.promesses = [];
    this.registreUtilisateur = registreUtilisateur;
  }

  attendFinEnregistrement () {
    return Promise.all(this.promesses);
  }

  enregistre (payload, timeout = 60000) {
    let delay = 100;
    const datePremierAppel = Date.now();
    const promesseDEnregistrement = new Promise((resolve, reject) => {
      const settingsAjax = {
        type: 'POST',
        url: `${process.env.URL_API}/api/evenements`,
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=utf-8',
        success: resolve,
        error: (xhr) => {
          if (this.registreUtilisateur.activeModeHorsLigne(xhr)) {
            this.enregistreEvenementEnLocale(payload);
            resolve();
          } else {
            if (Date.now() - datePremierAppel < timeout) {
              setTimeout(() => {
                delay = Math.min(delay * 2, 2000);
                this.$.ajax(settingsAjax);
              }, delay);
            } else {
              reject(xhr);
            }
          }
        }
      };
      this.$.ajax(settingsAjax);
    });
    this.promesses.push(promesseDEnregistrement);
    return promesseDEnregistrement;
  }

  creeEvenements (idClient, idEvaluation) {
    return new Promise((resolve, reject) => {
      this.$.ajax({
        type: 'POST',
        url: `${this.urlServeur}/api/evaluations/${idEvaluation}/collections_evenements`,
        data: JSON.stringify({ evenements: this.evenements(idClient) }),
        contentType: 'application/json; charset=utf-8',
        success: () => {
          window.localStorage.removeItem(this.cleEvenementsPourLocalStorage(idClient));
          resolve();
        },
        error: reject
      });
    });
  }

  enregistreEvenementEnLocale (payload) {
    const idClient = this.registreUtilisateur.idClient();
    const evenements = this.evenements(idClient);
    evenements.push(payload);
    this.enregistreEnLocale(this.cleEvenementsPourLocalStorage(idClient), evenements);
  }

  evenements (idClient) {
    const cle = this.cleEvenementsPourLocalStorage(idClient);
    return this.parseLocalStorage(cle, []);
  }

  cleEvenementsPourLocalStorage (idClient) {
    return `evenements_${idClient}`;
  }
}