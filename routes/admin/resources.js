const router = require('express').Router();
const Resource = require('../../database/models/Resource');

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

module.exports = router;
