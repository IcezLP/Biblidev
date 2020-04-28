const router = require('express').Router();
const Category = require('../../database/models/Category');

/**
 * Récupère les catégories
 *
 * @async
 * @route GET /api/admin/categories
 * @private
 */
router.get('/', async (req, res) => {
  try {
    // Cherche les catégories
    const categories = await Category.find();

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

/**
 * Supprime une catégorie
 *
 * @async
 * @route DELETE /api/admin/categories/:id
 * @private
 */
router.delete('/:id', async (req, res) => {
  try {
    // Cherche et supprime la catégorie
    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: {},
      message: 'La catégorie a été supprimée',
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
