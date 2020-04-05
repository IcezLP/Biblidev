const Validator = require('validator');
const { isEmpty, kebabCase } = require('lodash');
const { spaces, strength } = require('../../lib/regexp');

module.exports = async (data, User) => {
  const errors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.email = !isEmpty(data.email) ? data.email.toLowerCase() : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirm = !isEmpty(data.confirm) ? data.confirm : '';

  if (await User.findOne({ slug: kebabCase(data.username) })) {
    errors.username = "Ce nom d'utilisateur est déjà utilisé";
  }

  if (Validator.matches(data.username, spaces)) {
    errors.username = "Le nom d'utilisateur ne doit contenir d'espace";
  }

  if (!Validator.isLength(data.username, { min: 4, max: 20 })) {
    errors.username = "Le nom d'utilisateur doit être compris entre 4 et 20 charactères";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = 'Veuillez remplir ce champ';
  }

  if (await User.findOne({ email: data.email })) {
    errors.email = 'Cette adresse mail est déjà utilisée';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Cette adresse mail n'est pas valide";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Veuillez remplir ce champ';
  }

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
