const jwt = require('jsonwebtoken');

const JWT_SECRET = 'alexarif';  // Replace with your own secret key

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied.');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token.');
    req.user = user;
    next();
  });
};

const isLibrarian = (req, res, next) => {
  if (req.user.role !== 'librarian') return res.status(403).send('Access forbidden.');
  next();
};

module.exports = { authenticateToken, isLibrarian };
