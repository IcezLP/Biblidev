const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const loginFieldsValidation = require('../validation/auth/login');

router.post('/login', async (req, res) => {
  // Vérifie les champs du formulaire
  const errors = loginFieldsValidation(req.body);

  // Si le formulaire contient des erreurs
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      status: 'error',
      data: errors,
      message: null,
    });
  }

  try {
    // Cherche l'utilisateur
    const user = await User.findOne({ email: req.body.email });

    // Si aucun utilisateur n'est trouvé ou si le mot de passe ne correspond pas
    if (!user || (user && !(await bcrypt.compare(req.body.password, user.password)))) {
      return res.status(404).json({
        status: 'error',
        data: {},
        message: 'Adresse mail ou mot de passe incorrect',
      });
    }

    // Si l'utilisateur n'a pas confirmé son adresse e-mail
    if (!user.verified) {
      return res.status(400).json({
        status: 'error',
        data: {
          userId: user._id,
        },
        message: 'Veuillez confirmer votre adresse mail pour continuer',
      });
    }

    // Génere un token d'authentification
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    // Renvoi le token d'authentification
    return res.status(200).json({
      status: 'success',
      data: { token },
      message: null,
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayer',
    });
  }
});

router.get('/user/:token', async (req, res) => {
  const decoded = jwt.verify(req.params.token, process.env.TOKEN_SECRET);

  if (decoded && decoded._id) {
    try {
      const user = await User.findById(decoded._id, { password: 0 });

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
  }

  return res.status(400).json({
    status: 'error',
    data: {},
    message: 'Une erreur est survenue, veuillez réessayez',
  });
});

module.exports = router;
