const router = require('express').Router();
const Resource = require('../database/models/Resource');

/**
 * Récupère les ressources existantes
 *
 * @async
 * @route GET /api/resources
 * @public
 * @return {Array} Liste des catégories
 */
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find()
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
      message: 'Une erreur est survenue, veuillez réesayer',
    });
  }
});

module.exports = router;
