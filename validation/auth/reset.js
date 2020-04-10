const Validator = require('validator');
const { isEmpty } = require('lodash');
const { strength, spaces } = require('../../lib/regexp');

module.exports = (data) => {
  const errors = {};

  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirm = !isEmpty(data.confirm) ? data.confirm : '';

  if (!Validator.equals(data.password, data.confirm)) {
    errors.password = 'Les mots de passe de correspondent pas';
    errors.confirm = 'Les mots de passe de correspondent pas';
  }

  if (Validator.matches(data.password, spaces)) {
    errors.password = "Le mot de passe ne doit contenir d'espace";
  }

  if (!Validator.matches(data.password, strength)) {
    errors.password = 'Le mot de passe doit contenir 1 minuscule, 1 majuscule et 1 chiffre';
  }

  if (!Validator.isLength(data.password, { min: 8 })) {
    errors.password = 'Le mot de passe doit comprendre 8 charactères au minimum';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Veuillez remplir ce champ';
  }

  if (Validator.isEmpty(data.confirm)) {
    errors.confirm = 'Veuillez remplir ce champ';
  }

  return errors;
};
