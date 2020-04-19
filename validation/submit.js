const Validator = require('validator');
const { isEmpty, kebabCase } = require('lodash');
const { url } = require('../lib/regexp');

module.exports = async (data, file, Resource) => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.link = !isEmpty(data.link) ? data.link : '';
  data.price = !isEmpty(data.price) ? data.price : '';
  data.categories = !isEmpty(data.categories) ? JSON.parse(data.categories) : [];

  if (file) {
    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/x-icon'];
    const maxSize = 1024;

    if (types.includes(file.type)) {
      if (file.size / 1024 > maxSize) {
        errors.logo = 'Cette image est trop lourde, le poids maximum autorisé est de 1Mo';
      }
    } else {
      errors.logo =
        "Veuillez sélectionner une image correspondante a l'un des formats suivants: JPG, JPEG, PNG, ICO ou SVG";
    }
  }

  if (await Resource.findOne({ slug: kebabCase(data.name) })) {
    errors.name = 'Une ressource portant ce nom existe déjà';
  }

  if (!Validator.isLength(data.name, { min: 2, max: 24 })) {
    errors.name = 'Le nom doit être compris entre 2 et 24 charactères';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Veuillez remplir ce champ';
  }

  if (!Validator.isLength(data.description, { min: 50, max: 160 })) {
    errors.description = 'La description doit être comprise entre 50 et 160 charactères';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Veuillez remplir ce champ';
  }

  if (!Validator.matches(data.link, url)) {
    errors.link = "L'url doit commencer par http:// ou https://";
  }

  if (!Validator.isURL(data.link)) {
    errors.link = "Le lien n'est pas valide";
  }

  if (Validator.isEmpty(data.link)) {
    errors.link = 'Veuillez remplir ce champ';
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = 'Veuillez indiquer le prix';
  }

  if (data.categories.length === 0) {
    errors.categories = 'Veuillez sélectionner une catégorie au minimum';
  }

  if (data.categories.length > 5) {
    errors.categories = '5 catégories au maximum sont autorisées';
  }

  return errors;
};
