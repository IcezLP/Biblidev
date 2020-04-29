const router = require('express').Router();
const { kebabCase } = require('lodash');
const Category = require('../../database/models/Category');
const addCategoryFieldsValidation = require('../../validation/admin/categories/add');
const editCategoryFieldsValidation = require('../../validation/admin/categories/edit');

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

/**
 * Ajoute une catégorie
 *
 * @async
 * @route POST /api/admin/categories
 * @private
 */
router.post('/', async (req, res) => {
  // Vérifie les champs du formulaire
  const errors = await addCategoryFieldsValidation(req.body, Category);

  // Si le formulaire contient des erreurs
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      status: 'error',
      data: errors,
      message: null,
    });
  }

  // Déstructure les données reçu pour éviter l'injection de données non voulues
  const { name, plural_name } = req.body;

  try {
    // Initialise le pluriel
    let plural;
    // Si aucun pluriel n'a été défini, le remplace par le nom de la catégorie
    if (!plural_name) plural = name;
    else plural = plural_name;
    // Génère un slug à partir du nom de la ressource pour avoir des urls propres
    const slug = kebabCase(plural_name);

    // Initialise la nouvelle catégorie
    const category = new Category({
      name,
      plural_name: plural,
      slug,
    });

    // Sauvegarde la catégorie dans la db
    await category.save();

    return res.status(200).json({
      status: 'success',
      data: {},
      message: '',
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
 * Édite une catégorie
 *
 * @async
 * @route PUT /api/admin/categories/:id
 * @private
 */
router.put('/:id', async (req, res) => {
  try {
    // Cherche la catégorie à modifer
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: 'error',
        data: {},
        message: "Aucune catégorie correspondante n'a été trouvée",
      });
    }

    // Vérifie les champs du formulaire
    const errors = await editCategoryFieldsValidation(req.body, Category, category);

    // Si le formulaire contient des erreurs
    if (Object.keys(errors).length !== 0) {
      return res.status(400).json({
        status: 'error',
        data: errors,
        message: null,
      });
    }

    // Déstructure les données reçu pour éviter l'injection de données non voulues
    const { name, plural_name } = req.body;

    // Initialise le pluriel
    let plural;
    // Si un pluriel n'a pas été défini, le remplace par le nom de la catégorie
    if (!plural_name) plural = name;
    else plural = plural_name;
    // Génère un slug à partir du nom de la ressource pour avoir des urls propres
    const slug = kebabCase(plural_name);

    // Modifie et sauvegarde la catégorie dans la db
    await category.update({
      name,
      plural_name: plural,
      slug,
    });

    return res.status(200).json({
      status: 'success',
      data: {},
      message: '',
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
