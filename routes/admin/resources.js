const router = require('express').Router();
const moment = require('moment');
const { v2 } = require('cloudinary');
const Resource = require('../../database/models/Resource');
const User = require('../../database/models/User');
const sendEmail = require('../../services/amazon-ses');
const acceptedTemplate = require('../../emailTemplates/accepted');
const deniedTemplate = require('../../emailTemplates/denied');
const denyFieldsValidation = require('../../validation/admin/resources/deny');

const { hostname: cloud_name, username: api_key, password: api_secret } = new URL(
  process.env.CLOUDINARY_URL,
);

v2.config({
  cloud_name,
  api_key,
  api_secret,
});

/**
 * Récupère les ressources
 *
 * @async
 * @route GET /api/admin/resources
 * @private
 */
router.get('/', async (req, res) => {
  let state;
  let sort;

  switch (String(req.query.state)) {
    case 'valid':
      state = 'Validée';
      break;
    case 'awaiting':
      state = 'En attente de validation';
      break;
    default:
      state = 'Validée';
  }

  switch (String(req.query.sort)) {
    case 'none':
      sort = {};
      break;
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

  try {
    const resources = await Resource.find({ state })
      .sort(sort)
      .populate('categories')
      .populate('author', '_id username slug');

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
 * Ressources aimées par un utilisateur
 *
 * @async
 * @route GET /api/admin/resources/favorites/:id
 * @private
 */
router.get('/favorites/:id', async (req, res) => {
  try {
    const resources = await Resource.find({ favorites: req.params.id })
      .sort({ createdAt: 1 })
      .populate('author', '_id username slug');

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
 * Ressources partagées par un utilisateur
 *
 * @async
 * @route GET /api/admin/resources/favorites/:id
 * @private
 */
router.get('/shared/:id', async (req, res) => {
  try {
    const resources = await Resource.find({ author: req.params.id }).sort({ createdAt: 1 });

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
 * Valide une ressource
 *
 * @async
 * @route POST /api/admin/resources/accept/:id
 * @private
 */
router.post('/accept/:id', async (req, res) => {
  try {
    // Cherche la ressource
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      // Si aucune ressource n'est trouvée
      return res.status(400).json({
        status: 'error',
        data: {},
        message: "Aucune ressource n'a été trouvée",
      });
    }

    resource.state = 'Validée';

    resource.save(async (err) => {
      if (!err) {
        const user = await User.findById(resource.author);

        if (user && user.notifications) {
          const date = moment(resource.createdAt).format('DD MMMM YYYY');

          await sendEmail(
            [user.email],
            'Votre ressource a été acceptée',
            null,
            acceptedTemplate(user.username, date, resource.name),
          );
        }
      }
    });

    return res.status(200).json({
      status: 'success',
      data: {},
      message: 'La ressource a bien été validée',
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
 * Refuse une ressource
 *
 * @async
 * @route PUT /api/admin/resources/deny/:id
 * @private
 */
router.put('/deny/:id', async (req, res) => {
  // Vérifie les champs du formulaire
  const errors = denyFieldsValidation(req.body);

  // Si le formulaire contient des erreurs
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      status: 'error',
      data: errors,
      message: null,
    });
  }

  try {
    const { custom } = req.body;
    let reason;

    switch (req.body.reason) {
      case 'exist':
        reason = 'La ressource existe déjà';
        break;
      case 'rules':
        reason = 'La ressource ne respecte pas les règles';
        break;
      default:
        reason = custom;
    }

    // Cherche la ressource
    const resource = await Resource.findById(req.params.id);

    if (resource.logo) {
      // Supprime l'image du serveur Cloudinary
      await v2.uploader.destroy(resource.logo);
    }

    if (!resource) {
      // Si aucune ressource n'est trouvée
      return res.status(400).json({
        status: 'error',
        data: {},
        message: "Aucune ressource n'a été trouvée",
      });
    }

    const user = await User.findById(resource.author);

    resource.remove(async (err) => {
      if (!err) {
        if (user && user.notifications) {
          const date = moment(resource.createdAt).format('DD MMMM YYYY');

          await sendEmail(
            [user.email],
            'Votre ressource a été refusée',
            null,
            deniedTemplate(user.username, date, resource.name, reason),
          );
        }
      }
    });

    return res.status(200).json({
      status: 'success',
      data: {},
      message: 'La ressource a été refusée',
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
 * Supprime une ressource
 *
 * @async
 * @route DELETE /api/admin/resources/:id
 * @private
 */
router.delete('/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: {},
      message: 'La ressource a été supprimée',
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
