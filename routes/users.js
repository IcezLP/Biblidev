const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../database/models/User');
const Resource = require('../database/models/Resource');
const withUser = require('./middlewares/withUser');

/**
 * Récupère les information d'un utilisateur via son id pour maintenir la connexion
 *
 * @async
 * @route GET /api/users/:id
 * @public
 * @return {Object} Informations utilisateur
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        data: {},
        message: "Aucun utilisateur n'a été trouvé",
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { user },
      message: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayez',
    });
  }
});

/**
 * Ajoute ou retire une ressource des favoris
 *
 * @async
 * @route PUT /api/users/favorite/:userId/:resourceId
 * @public
 */
router.put('/favorite/:userId/:resourceId', withUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        data: {},
        message: "Aucun utilisateur correspondant n'a été trouvé",
      });
    }

    const resource = await Resource.findById(req.params.resourceId);

    if (!resource) {
      return res.status(404).json({
        status: 'error',
        data: {},
        message: "Aucune ressource correspondant n'a été trouvée",
      });
    }

    if (user.favorites.includes(mongoose.Types.ObjectId(resource._id))) {
      const index = user.favorites.indexOf(mongoose.Types.ObjectId(resource._id));

      await user.favorites.splice(index, 1);

      await user.save();

      return res.status(200).json({
        status: 'success',
        data: { update: 'remove' },
        message: null,
      });
    }

    await user.favorites.push(mongoose.Types.ObjectId(resource._id));

    await user.save();

    return res.status(200).json({
      status: 'success',
      data: { update: 'add' },
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
