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
  try {
    const { username, password } = req.body;

    const users = await db.collection('librarians').where('username', '==', username).get();
    if (users.empty) {
      return res.status(404).json({ message: 'User not found.' }); // Use 404 for not found
    }

    const user = users.docs[0].data();
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Use 401 for unauthorized
    }

    const token = jwt.sign({ id: users.docs[0].id, role: user.role }, JWT_SECRET);

    // Send a structured JSON response with the token
    res.json({
      message: 'Logged in successfully.',
      token: token,
      userId: users.docs[0].id, // Include user ID if needed on the frontend
      userRole: user.role  // Include user role if relevant for authorization
    });
  } catch (error) {
    console.error("Error during login:", error, token); // Log errors for debugging
    res.status(500).json({ message: 'Internal server error.'}); // Use 500 for internal errors
  }
};


module.exports = { registerLibrarian, login };
