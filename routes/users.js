const router = require('express').Router();
const User = require('../database/models/User');
const authenticateJwt = require('../middlewares/authenticateJwt');

/**
 * Récupère les information d'un utilisateur via son id
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
      data: user,
      message: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réesayer',
    });
  }
});

module.exports = router;
