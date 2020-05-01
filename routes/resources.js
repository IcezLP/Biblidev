const router = require('express').Router();
const formidable = require('formidable');
const { v2 } = require('cloudinary');
const { kebabCase } = require('lodash');
const mongoose = require('mongoose');
const Resource = require('../database/models/Resource');
const User = require('../database/models/User');
const submitFieldsValidation = require('../validation/submit');

const { hostname: cloud_name, username: api_key, password: api_secret } = new URL(
  process.env.CLOUDINARY_URL,
);

v2.config({
  cloud_name,
  api_key,
  api_secret,
});

/**
 * Récupère les ressources existantes
 *
 * @async
 * @route GET /api/resources
 * @public
 * @return {Array} Liste des catégories
 */
router.get('/', async (req, res) => {
  const price = req.query.price ? req.query.price : null;
  const categories = req.query.categories ? req.query.categories.split(';') : null;
  let sort;
  let includes;

  switch (req.query.includes) {
    case 'in':
      includes = '$in';
      break;
    case 'all':
      includes = '$all';
      break;
    default:
      includes = '$in';
  }

  switch (req.query.sort) {
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    case 'ascending':
      sort = { slug: 1 };
      break;
    case 'descending':
      sort = { slug: -1 };
      break;
    default:
      sort = { slug: 1 };
  }

  const search = req.query.search
    ? {
        state: 'Validée',
        ...(price && { price }),
        ...(categories && { categories: { [includes]: categories } }),
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {
        state: 'Validée',
        ...(price && { price }),
        ...(categories && { categories: { [includes]: categories } }),
      };

  try {
    const resources = await Resource.find(search)
      .sort(sort)
      .populate('categories')
      .populate('author', '-_id username slug');

    return res.status(200).json({
      status: 'success',
      data: { resources },
      message: null,
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayez',
    });
  }
});

/**
 * Proposition de ressource pas un utilisateur
 *
 * @async
 * @route POST /api/resources/submit
 * @public
 */
router.post('/submit', async (req, res) => {
  const form = new formidable.IncomingForm();

  return form.parse(req, async (err, fields, files) => {
    // Vérifie les champs du formulaire
    const errors = await submitFieldsValidation(fields, files.logo, Resource);

    // Si le formulaire contient des erreurs
    if (Object.keys(errors).length !== 0) {
      return res.status(400).json({
        status: 'error',
        data: errors,
        message: null,
      });
    }

    // Déstructure les données reçu pour éviter l'injection de données non voulues
    const { name, description, link, price, user } = fields;
    // Extrait les catégories et les converties en tableau d'ObjectID
    let categories = Array.isArray(fields.categories)
      ? fields.categories
      : JSON.parse(fields.categories);
    categories = categories.map((category) => mongoose.Types.ObjectId(category));
    // Génère un slug à partir du nom de la ressource pour avoir des urls propres
    const slug = kebabCase(name);
    // Convertie l'utilisateur en ObjectID ou génère un ObjectID factice
    const author = user ? mongoose.Types.ObjectId(user) : new mongoose.mongo.ObjectId();
    // Initialise le logo
    let logo;

    // Si un fichier est reçu
    if (files && files.logo) {
      try {
        // Upload sur le serveur cloud de Cloudinary
        const { public_id } = await v2.uploader.upload(files.logo.path);
        logo = public_id;
      } catch (error) {
        console.log(error);
      }
    }

    try {
      // Initialise la nouvelle ressource
      const resource = new Resource({
        logo,
        name,
        slug,
        description,
        categories,
        link,
        price,
        author,
        state: 'En attente de validation',
      });

      // Sauvegarde la ressource dans la DB
      await resource.save();

      return res.status(200).json({
        status: 'success',
        data: {},
        message: null,
      });
    } catch (error) {
      // Si une erreur inconnue arrive
      return res.status(400).json({
        status: 'error',
        data: {},
        message: 'Une erreur est survenue, veuillez réessayez',
      });
    }
  });
});

/**
 * Note une ressource
 *
 * @async
 * @route PUT /api/resources/rate/:userId/:resourceId
 * @private
 */
router.put('/rate/:userId/:resourceId', async (req, res) => {
  const { userId, resourceId } = req.params;
  const { value } = req.body;

  if (value > 5 || value < 0) {
    return res.status(404).json({
      status: 'error',
      data: {},
      message: 'La valeur est incorrecte',
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        data: {},
        message: "Aucun utilisateur correspondant n'a été trouvé",
      });
    }

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        status: 'error',
        data: {},
        message: "Aucune ressource correspondant n'a été trouvée",
      });
    }

    // Si l'utilisateur a déjà noté la ressource
    if (resource.rates.some((item) => item.user.toString() === user._id.toString())) {
      // Récupère l'index de la note de l'utilisateur
      const index = resource.rates.map((item) => item.user).indexOf(user._id);

      // Supprime la note de l'utilisateur
      if (value === 0) {
        await resource.rates.splice(index, 1);
        // Met à jour la ressource dans la db
        await resource.save();

        return res.status(200).json({
          status: 'success',
          data: { update: resource.rates },
          message: null,
        });
      }

      resource.rates[index].rate = value;

      // Met à jour la ressource dans la db
      await resource.save();

      return res.status(200).json({
        status: 'success',
        data: { update: resource.rates },
        message: null,
      });
    }

    // Ajout la note de l'utilisateur aux notes déjà existantes
    await resource.rates.push({
      rate: value,
      user: mongoose.Types.ObjectId(user._id),
    });

    // Met à jour la ressource dans la db
    await resource.save();

    return res.status(200).json({
      status: 'success',
      data: { update: resource.rates },
      message: null,
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayez',
    });
  }
});

module.exports = router;
