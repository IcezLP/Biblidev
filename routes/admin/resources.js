const router = require('express').Router();
const moment = require('moment');
const Resource = require('../../database/models/Resource');
const User = require('../../database/models/User');
const sendEmail = require('../../services/amazon-ses');
const acceptedTemplate = require('../../emailTemplates/accepted');

/**
 * Ressources en attentes de validation
 *
 * @async
 * @route GET /api/admin/resources/awaiting
 * @private
 */
router.get('/awaiting', async (req, res) => {
  try {
    const resources = await Resource.find({ state: 'En attente de validation' })
      .sort({ createdAt: 1 })
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
      message: 'Une erreur est survenue, veuillez réesayer',
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
      message: 'Une erreur est survenue, veuillez réesayer',
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
      message: 'Une erreur est survenue, veuillez réesayer',
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
      message: null,
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réesayer',
    });
  }
});

module.exports = router;
