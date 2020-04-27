const Validator = require('validator');
const { isEmpty, kebabCase } = require('lodash');
const probe = require('probe-image-size');
const axios = require('axios');
const { url } = require('../../../lib/regexp');

module.exports = async (data, Resource) => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.link = !isEmpty(data.link) ? data.link : '';
  data.price = !isEmpty(data.price) ? data.price : '';
  data.logo = !isEmpty(data.logo) ? data.logo : '';
  data.categories = !isEmpty(data.categories) ? data.categories.split(';') : [];

  if (!Validator.isEmpty(data.logo)) {
    if (!Validator.matches(data.logo, url)) {
      errors.logo = 'Le lien du logo doit commencer par http:// ou https://';
    }

    if (!Validator.isURL(data.logo)) {
      errors.logo = "Le lien du logo n'est pas valide";
    }

    if (!errors.logo) {
      const types = [
        'image/jpg',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/x-icon',
        'image/vnd.microsoft.icon',
      ];
      const maxSize = 1024;

      try {
        const result = await probe(data.logo, { timeout: 5000 });

        if (types.includes(result.mime)) {
          if (result.length / 1024 > maxSize) {
            errors.logo = "L'image choisie est trop lourde, le poids maximum autorisé est de 1Mo";
          }
        } else {
          errors.logo =
            "Veuillez sélectionner une image correspondante a l'un des formats suivants: JPG, JPEG, PNG, ICO ou SVG";
        }
      } catch (error) {
        if (error.message === 'unrecognized file format') {
          const response = await axios.get(data.logo);
          if (!types.includes(response.headers['content-type'])) {
            errors.logo =
              "Veuillez sélectionner une image correspondante a l'un des formats suivants: JPG, JPEG, PNG, ICO ou SVG";
          }
        } else if (error.statusCode === 403) {
          errors.logo = "Le serveur distant à refusé l'accès à l'image";
        } else {
          errors.logo = "Une erreur est survenue lors de la vérification de l'image";
        }
      }
    }
  }

  if (await Resource.findOne({ slug: kebabCase(data.name) })) {
    errors.name = 'Le nom est déjà utilisé par une ressource existante';
  }

  if (!Validator.isLength(data.name, { min: 2, max: 24 })) {
    errors.name = 'Le nom doit être compris entre 2 et 24 charactères';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Le nom est manquant';
  }

  if (!Validator.isLength(data.description, { min: 50, max: 160 })) {
    errors.description = 'La description doit être comprise entre 50 et 160 charactères';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'La description est manquante';
  }

  if (!Validator.matches(data.link, url)) {
    errors.link = 'Le lien de la ressource doit commencer par http:// ou https://';
  }

  if (!Validator.isURL(data.link)) {
    errors.link = "Le lien de la ressource n'est pas valide";
  }

  if (Validator.isEmpty(data.link)) {
    errors.link = 'Le lien de la ressource est manquant';
  }

  if (data.categories.length === 0) {
    errors.categories = 'Veuillez sélectionner une catégorie au minimum';
  }

  if (data.categories.length > 5) {
    errors.categories = '5 catégories au maximum sont autorisées';
  }

  return errors;
};
