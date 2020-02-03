const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Enter a valid email').isEmail(),
  check('password', 'Password should be atleast 6 characters').isLength({ min: 6 }),
], authController.postRegister);

router.post('/login', [
  check('email', 'Enter a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], authController.postLogin);

router.get('/user', auth, authController.getUser);

router.get('/verify/resend', auth, authController.getResend)

router.get('/verify/:verificationToken', authController.getVerify);

router.get('/reset/:resetToken', authController.getReset);

router.post('/reset-email', [
  check('resetEmail', 'Enter a valid email').isEmail()
], authController.postResetMail);

router.post('/reset-password', [
  check('password', 'Password should be atleast 6 characters').isLength({ min: 6 })
], authController.postResetPassword);

module.exports = router;