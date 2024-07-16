const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authenticateToken, isLibrarian } = require('./middleware/auth');
const { validateAddMember } = require('./middleware/validate');
const authController = require('./controllers/authcontroller');
const memberController = require('./controllers/membercontroller');
const db = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: '*', // Updated origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const PORT = process.env.PORT || 3000;

// Auth routes
app.post('/register-librarian', authController.registerLibrarian);
app.post('/login', authController.login);

// Member routes
app.get('/members', authenticateToken, isLibrarian, memberController.getAllMembers);
app.get('/members/search', authenticateToken, isLibrarian, memberController.searchMembers);
app.post('/members', authenticateToken, isLibrarian, validateAddMember, memberController.addMember);

// Example route to demonstrate database connection
app.get('/test', async (req, res) => {
    try {
      const snapshot = await db.collection('testCollection').get();
      const data = snapshot.docs.map(doc => doc.data());
      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
