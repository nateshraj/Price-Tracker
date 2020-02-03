const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.id = decoded.id;
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
}