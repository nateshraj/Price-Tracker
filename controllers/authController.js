const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const sendgrid = require('@sendgrid/mail');
const User = require('../models/User');

exports.postRegister = async (req, res) => {
  const errors = validationResult(req);
  const { name, email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user = new User({ name, email, password: hashedPassword, verificationToken });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 3600 });
    res.json({ token });

    sendMail(user, 'verify');
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server error');
  }
};

exports.postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email does not exist' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 3600 });
    res.json({ token });
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server error');
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.id).select('-password');
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }
    res.json(user);

  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server error');
  }
};

exports.getReset = async (req, res) => {
  const resetToken = req.params.resetToken;
  try {
    const user = await User.findOne({ resetToken });
    if (!user) {
      return res.status(400).send('Invalid reset token. Please click on the reset link sent to your email.');
    }
    res.status(200).send('Reset Password');
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server error');
  }

}

exports.getVerify = async (req, res) => {
  const verificationToken = req.params.verificationToken;
  try {
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(400).send('Invalid verification token. Please click on the verification link sent to your email.');
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    req.io.sockets.emit('updatedEmail', 'User has been refreshed');
    res.status(200).send('Your email has been verified. Redirecting you to the login page.');
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server error');
  }

}

exports.getResend = async (req, res) => {
  try {
    const user = await User.findById(req.id).select('-password');
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }
    sendMail(user, 'verify');
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server error');
  }
}

exports.postResetMail = async (req, res) => {
  const errors = validationResult(req);
  const { resetEmail } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: resetEmail });
    if (!user) {
      return res.status(400).json({ msg: 'Email does not exist' });
    }
    if (!user.resetToken) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetToken = resetToken;
      await user.save();
    }
    sendMail(user, 'reset');
    res.status(200).send('Reset email has been sent.');
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server error');
  }
};

exports.postResetPassword = async (req, res) => {
  const errors = validationResult(req);
  const { resetToken, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ resetToken });
    if (!user) {
      return res.status(400).json({ msg: 'Reset token does not exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    await user.save();
    res.status(200).send('Your password has been reset.');

  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server error');
  }
};


const sendMail = async (user, type) => {
  const { email, name, verificationToken, resetToken } = user;

  const templateData = type === 'verify' ? {
    subject: 'Welcome to P₹ice Tracker!',
    text: `Hi ${name}, thanks for signing up! Please click the button below to verify your account.`,
    buttonText: `Click here to ${type} account`,
    link: `http://trackprice.herokuapp.com/verify/${verificationToken}`
  } : {
      subject: 'P₹ice Tracker - Reset Password',
      text: `Hi ${name}, please click the button below to reset your account.`,
      buttonText: `Click here to ${type} account`,
      link: `http://trackprice.herokuapp.com/reset/${resetToken}`
    };

  const message = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    templateId: 'd-78bd5196044e4c7b9359f7d85efa8418',
    dynamic_template_data: templateData
  };

  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  await sendgrid.send(message);
}