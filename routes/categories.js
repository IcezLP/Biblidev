const router = require('express').Router();
const Category = require('../database/models/Category');

/**
 * Récupère les catégories existantes
 *
 * @async
 * @route GET /api/categories
 * @public
 * @return {Array} Liste des catégories
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ plural_name: 1 });

    return res.status(200).json({
      status: 'success',
      data: { categories },
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
