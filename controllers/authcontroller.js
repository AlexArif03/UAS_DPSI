const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config');

const JWT_SECRET = 'alexarif';  // Replace with your own secret key

const registerLibrarian = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection('librarians').add({
    username,
    password: hashedPassword,
    role: 'librarian'
  });

  res.status(201).send('Librarian registered.');
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const users = await db.collection('librarians').where('username', '==', username).get();
  if (users.empty) return res.status(400).send('User not found.');

  const user = users.docs[0].data();
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid credentials.');

  const token = jwt.sign({ id: users.docs[0].id, role: user.role }, JWT_SECRET);
  res.header('Authorization', token).send('Logged in.');
};

module.exports = { registerLibrarian, login };
