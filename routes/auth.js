const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { kebabCase } = require('lodash');
const crypto = require('crypto');
const User = require('../database/models/User');
const Token = require('../database/models/Token');
const loginFieldsValidation = require('../validation/auth/login');
const registerFieldsValidation = require('../validation/auth/register');
const forgotFieldsValidation = require('../validation/auth/forgot');
const sendEmail = require('../services/amazon-ses');
const verifyTemplate = require('../emailTemplates/verify');

/**
 * Connecter un utilisateur
 *
 * @async
 * @route POST /api/auth/login
 * @public
 * @return {String} Token d'authentification
 */
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
        message: 'Adresse e-mail ou mot de passe incorrect',
      });
    }

    // Si l'utilisateur n'a pas confirmé son adresse e-mail
    if (!user.verified) {
      return res.status(400).json({
        status: 'error',
        data: {},
        message: 'Veuillez confirmer votre adresse e-mail pour continuer',
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

/**
 * Inscrire un utilisateur
 *
 * @async
 * @route POST /api/auth/register
 * @public
 */
router.post('/register', async (req, res) => {
  // Vérifie les champs du formulaire
  const errors = await registerFieldsValidation(req.body, User);

  // Si le formulaire contient des erreurs
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      status: 'error',
      data: errors,
      message: null,
    });
  }

  try {
    // Déstructure les données reçu pour éviter l'injection de données non voulues
    const { username, email, password } = req.body;
    // Génère un slug à partir du nom d'utilisateur pour avoir des urls propres
    const slug = kebabCase(username);
    // Hash le mot de passe pour qu'il ne soit pas affiché en clair dans la db
    const hash = await bcrypt.hash(password, 10);
    // Génère un token pour la validation de l'email
    const token = crypto.randomBytes(32).toString('hex');
    // Récupère la date au format timestamp
    const date = new Date();
    // Génère un avatar via l'API de http://avatars.adorable.io/
    const avatar = `https://api.adorable.io/avatars/200/${date.getTime()}-${slug}.png`;

    // Initialise le nouvel utilisateur
    const user = new User({
      avatar,
      username,
      slug,
      email,
      verified: false,
      password: hash,
      isAdmin: false,
    });

    // Sauvegarde l'utilisateur dans la db
    await user.save(async (error) => {
      if (error) {
        console.log(error);
      } else {
        // Sauvegarde le token dans la db
        await Token.create({
          type: 'emailValidation',
          user: user._id,
          token,
          createdAt: date,
        });

        await sendEmail(
          [email],
          "Confirmation de l'adresse mail",
          null,
          verifyTemplate(user.username, `${process.env.SITE_URL}/verification?token=${token}`),
        );
      }
    });

    return res.status(200).json({
      status: 'success',
      data: {},
      message: null,
    });
  } catch (error) {
    console.log(error);
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayer',
    });
  }
});

/**
 * Demande de mot de passe oublié
 *
 * @async
 * @route POST /api/auth/forgot
 * @public
 */
router.post('/forgot', async (req, res) => {
  // Vérifie les champs du formulaire
  const errors = forgotFieldsValidation(req.body);

  // Si le formulaire contient des erreurs
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      status: 'error',
      data: errors,
      message: null,
    });
  }
});

/**
 * Vérifie l'adresse mail d'un utilisateur
 *
 * @async
 * @route POST /api/auth/verify/:token
 * @public
 */
router.post('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const verify = await Token.findOne({ token });
    console.log(verify);

    if (!verify || (verify && verify.type !== 'emailValidation')) {
      return res.status(400).json({
        status: 'error',
        data: {},
        message: "Aucune vérification correspondante n'a été trouvée",
      });
    }

    await verify.remove();
    await User.findByIdAndUpdate(verify.user, { $set: { verified: true } });

    return res.status(200).json({
      status: 'success',
      data: {},
      message: 'Votre adresse mail est validée, vous pouvez maintenant vous connecter',
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

module.exports = router;
